import Database from 'better-sqlite3';
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../frontend/ca_disability_navigator.db');
const db = new Database(dbPath);

// Drop the old confusingly named table if it exists
db.exec(`DROP TABLE IF EXISTS advocate_personas`);

// Define table to store scraped advocate copy writing styles
db.exec(`
  CREATE TABLE IF NOT EXISTS writing_styles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    credentials TEXT NOT NULL,
    source_url TEXT NOT NULL,
    avg_sentence_length REAL NOT NULL,
    signature_phrases TEXT NOT NULL, -- JSON array
    emotional_tone TEXT NOT NULL,
    vocab_frequency TEXT NOT NULL,    -- JSON map of top keywords
    sample_corpus TEXT NOT NULL
  )
`);

// Fetch targets dynamically from the database to avoid hardcoding URLs
function getTargetsFromDb() {
  try {
    const rows = db.prepare('SELECT id, name, credentials, source_url FROM writing_styles').all();
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      credentials: r.credentials,
      url: r.source_url
    }));
  } catch (err) {
    console.error("⚠️ Failed to query target writing styles from DB:", err.message);
    return [];
  }
}

function analyzeWritingStyle(text) {
  // Split into sentences (by period, exclamation, question mark)
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  
  // Calculate average sentence length
  let totalWordsInSentences = 0;
  for (const s of sentences) {
    totalWordsInSentences += s.split(/\s+/).length;
  }
  const avgSentenceLength = sentences.length > 0 ? (totalWordsInSentences / sentences.length) : 15;
  
  // Exclude common stopwords to find signature vocabulary
  const stopwords = new Set([
    'the', 'and', 'for', 'you', 'that', 'with', 'this', 'have', 'from', 'your', 'are', 'not', 'but', 'what', 'can', 'will', 'about',
    'their', 'they', 'our', 'more', 'how', 'who', 'his', 'her', 'she', 'him', 'them', 'out', 'all', 'any', 'one', 'has', 'had', 'was',
    'been', 'were', 'would', 'should', 'could', 'some', 'than', 'then', 'into', 'only', 'other', 'its', 'also', 'very', 'does', 'did'
  ]);
  
  const wordCounts = {};
  for (const w of words) {
    if (!stopwords.has(w)) {
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    }
  }
  
  // Sort vocabulary frequency
  const sortedVocab = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .reduce((obj, [key, val]) => {
      obj[key] = val;
      return obj;
    }, {});
    
  // Extract bigrams/phrases (groups of 2 words)
  const bigramCounts = {};
  const splitWords = text.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z]/g, '')).filter(w => w.length > 2);
  for (let i = 0; i < splitWords.length - 1; i++) {
    const wordA = splitWords[i];
    const wordB = splitWords[i+1];
    if (!stopwords.has(wordA) || !stopwords.has(wordB)) {
      const phrase = `${wordA} ${wordB}`;
      bigramCounts[phrase] = (bigramCounts[phrase] || 0) + 1;
    }
  }
  
  const sortedBigrams = Object.entries(bigramCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([phrase]) => phrase);

  // Simple heuristic to detect tone
  let emotionalTone = 'informative-neutral';
  const lowerText = text.toLowerCase();
  
  let legalScore = (lowerText.match(/law|regulation|code|court|statute|act|legal|entitle/g) || []).length;
  let emotionScore = (lowerText.match(/parent|family|worry|feel|child|support|help|anxious|care/g) || []).length;
  let combativeScore = (lowerText.match(/fight|demand|refuse|reject|denial|delay|never|document/g) || []).length;
  
  if (legalScore > emotionScore && legalScore > combativeScore) {
    emotionalTone = 'legalistic-precise';
  } else if (combativeScore > legalScore && combativeScore > emotionScore) {
    emotionalTone = 'assertive-protective';
  } else if (emotionScore > legalScore && emotionScore > combativeScore) {
    emotionalTone = 'supportive-collaborative';
  }
  
  return {
    avgSentenceLength: parseFloat(avgSentenceLength.toFixed(1)),
    vocab: sortedVocab,
    phrases: sortedBigrams,
    emotionalTone
  };
}

async function run() {
  console.log("🚀 Starting Personality Style Scraper (Playwright)...");
  
  const targets = getTargetsFromDb();
  if (targets.length === 0) {
    console.log("⚠️ No writing styles targets found in DB to scrape.");
    db.close();
    return;
  }
  
  console.log(`Loaded ${targets.length} targets from the DB.`);
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Clean user agent headers to bypass simple blockers
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
  });
  
  const insertStmt = db.prepare(`
    INSERT INTO writing_styles 
      (id, name, credentials, source_url, avg_sentence_length, signature_phrases, emotional_tone, vocab_frequency, sample_corpus)
    VALUES 
      ($id, $name, $credentials, $source_url, $avg_sentence_length, $signature_phrases, $emotional_tone, $vocab_frequency, $sample_corpus)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      credentials = excluded.credentials,
      source_url = excluded.source_url,
      avg_sentence_length = excluded.avg_sentence_length,
      signature_phrases = excluded.signature_phrases,
      emotional_tone = excluded.emotional_tone,
      vocab_frequency = excluded.vocab_frequency,
      sample_corpus = excluded.sample_corpus
  `);
  
  for (const target of targets) {
    // Skip if URL is invalid or placeholder
    if (!target.url || target.url.includes('example.com') || target.url.startsWith('https://www.wrightslaw.com/blog/')) {
      console.log(`\n⏭️ Skipping placeholder/invalid URL for: ${target.name} (${target.url})`);
      continue;
    }

    console.log(`\nCrawling writing style for: ${target.name} (${target.url})...`);
    
    let success = false;
    let attempts = 3;
    let cleanText = '';

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`  - Attempt ${attempt}/${attempts}...`);
        await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(2000); // let rendering finish
        
        // Extract main article text body
        const articleText = await page.evaluate(() => {
          const selectors = [
            'article', '.entry-content', '.post-content', '.content-area', '#content', 'main'
          ];
          for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && el.innerText.length > 500) {
              return el.innerText;
            }
          }
          return document.body.innerText; // Fallback
        });
        
        cleanText = articleText
          .replace(/\s+/g, ' ')
          .replace(/Copyright.*All rights reserved.*/gi, '')
          .trim();
          
        if (cleanText.length >= 500) {
          success = true;
          break;
        } else {
          console.warn(`  ⚠️ Attempt ${attempt} returned content too short (${cleanText.length} chars).`);
        }
      } catch (err) {
        console.warn(`  ⚠️ Attempt ${attempt} failed: ${err.message}`);
      }
    }
    
    if (!success) {
      console.error(`❌ Skipped ${target.name} after failing all ${attempts} attempts.`);
      continue;
    }
    
    console.log(`✓ Fetched ${cleanText.length} characters of clean writing corpus.`);
    
    // Analyze writing style
    const analysis = analyzeWritingStyle(cleanText);
    console.log(`  - Avg Sentence Length: ${analysis.avgSentenceLength} words`);
    console.log(`  - Emotional Tone: ${analysis.emotionalTone}`);
    console.log(`  - Signature Bigrams: ${analysis.phrases.slice(0, 4).join(', ')}`);
    
    // Save results
    try {
      insertStmt.run({
        id: target.id,
        name: target.name,
        credentials: target.credentials,
        source_url: target.url,
        avg_sentence_length: analysis.avgSentenceLength,
        signature_phrases: JSON.stringify(analysis.phrases),
        emotional_tone: analysis.emotionalTone,
        vocab_frequency: JSON.stringify(analysis.vocab),
        sample_corpus: cleanText.substring(0, 10000) // limit sample storage size
      });
      console.log(`✓ Stored style profile for ${target.name} in DB.`);
    } catch (dbErr) {
      console.error(`❌ DB error saving profile for ${target.name}:`, dbErr.message);
    }
  }
  
  await browser.close();
  db.close();
  console.log("\n✨ Personality style crawling and analysis complete.");
}

run().catch(err => {
  console.error("Fatal error during crawler execution:", err);
  db.close();
  process.exit(1);
});
