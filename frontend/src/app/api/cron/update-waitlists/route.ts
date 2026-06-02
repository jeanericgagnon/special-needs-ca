import { NextRequest, NextResponse } from 'next/server';
import { updateWaitlistStatus, getProgramWaitlists } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const targetUrl = 'https://www.dhcs.ca.gov/services/long-term-care-alternatives-home-and-community-based-service-options/home-and-community-based-alternatives-waiver-2/';
  const fallbackRepoUrl = 'https://raw.githubusercontent.com/jeanericgagnon/special-needs-ca/main/src/data/raw/dhcs_hcba.json';
  
  const logs: string[] = [];
  let isWaitlistActive = true;
  let status: 'critical' | 'moderate' | 'standard' | 'priority' = 'critical';
  let durationLabel = '1.5 to 2+ Years Wait';
  let durationMonths = 24;
  let description = 'California capped enrollment for the HCBA Waiver in July 2023. Newly submitted applications face significant wait times unless reserve capacity criteria apply.';
  let resolvedSource = 'live';

  logs.push(`Starting dynamic waitlist status check at: ${new Date().toISOString()}`);
  
  try {
    logs.push(`Attempting live crawl on DHCS: ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 0 }
    });

    let htmlText = '';
    if (response.ok) {
      htmlText = await response.text();
    }

    // Detect if blocked by Incapsula/Imperva or rate-limited
    const isBlocked = !response.ok || 
                      htmlText.length < 1000 || 
                      htmlText.includes('Incapsula') || 
                      htmlText.includes('_Incapsula_Resource');

    if (isBlocked) {
      logs.push(`⚠️ Live crawl blocked or challenged by Incapsula CDN security (Page size: ${htmlText.length} bytes).`);
      logs.push(`Falling back to verified repository cache: ${fallbackRepoUrl}`);
      resolvedSource = 'repository-cache';

      // Load from repo URL
      const fallbackResponse = await fetch(fallbackRepoUrl, { 
        next: { revalidate: 0 } 
      });

      if (!fallbackResponse.ok) {
        logs.push(`⚠️ Remote GitHub cache fetch failed. Falling back to local file system cache.`);
        
        // Final fallback: Load from local workspace directory relative to execution
        // Under Next.js, cwd is usually /frontend/
        const localCachePath = path.resolve(process.cwd(), '../src/data/raw/dhcs_hcba.json');
        
        if (fs.existsSync(localCachePath)) {
          const rawData = fs.readFileSync(localCachePath, 'utf-8');
          const cacheData = JSON.parse(rawData);
          logs.push(`✓ Loaded local file cache successfully from: ${localCachePath}`);
          
          // Parse fields from local JSON
          const enrollmentSec = cacheData.sections?.find((s: any) => s.heading === 'Enrollment');
          const textContent = enrollmentSec ? enrollmentSec.content.join(' ') : '';
          
          if (textContent.includes('waiting list has been implemented')) {
            logs.push('✓ Verified local cache: waitlist reference found.');
            isWaitlistActive = true;
          }
        } else {
          throw new Error('All crawler sources (live page, GitHub raw cache, and local file cache) are unavailable.');
        }
      } else {
        const cacheData = await fallbackResponse.json();
        logs.push(`✓ Loaded remote GitHub cache successfully.`);
        
        const enrollmentSec = cacheData.sections?.find((s: any) => s.heading === 'Enrollment');
        const textContent = enrollmentSec ? enrollmentSec.content.join(' ') : '';
        
        if (textContent.includes('waiting list has been implemented')) {
          logs.push('✓ Verified remote cache: waitlist reference found.');
          isWaitlistActive = true;
        }
      }
    } else {
      logs.push(`✓ Live page crawl succeeded (size: ${htmlText.length} bytes).`);
      
      const hasWaitlistKeywords = htmlText.toLowerCase().includes('waiting list') || 
                                 htmlText.toLowerCase().includes('waitlist') ||
                                 htmlText.toLowerCase().includes('maximum capacity');

      if (hasWaitlistKeywords) {
        logs.push('✓ Verified: Waitlist keywords found in live HTML.');
        isWaitlistActive = true;
      } else {
        logs.push('⚠️ Waitlist keywords not found in live HTML. Marking waitlist as standard/moderate.');
        isWaitlistActive = false;
        status = 'moderate';
        durationLabel = 'Standard Intake (Waitlist Suspended)';
        durationMonths = 3;
        description = 'DHCS indicates that the waitlist is currently inactive or suspended. New applicants may be processed under standard timelines.';
      }
    }

    // Update database row
    const isVercel = process.env.VERCEL === '1';
    let dbUpdated = false;
    
    if (!isVercel) {
      logs.push('Updating SQLite navigator database program_waitlists table...');
      dbUpdated = updateWaitlistStatus('hcba', durationLabel, durationMonths, status, description);
      logs.push(dbUpdated ? '✓ Database successfully updated on disk.' : '✓ Database on disk up-to-date.');
    } else {
      logs.push('⚠️ Running in Serverless mode on Vercel. Database disk update bypassed.');
    }

    // Retrieve active database records
    const waitlists = getProgramWaitlists();
    const hcbaWl = waitlists.find(w => w.program_id === 'hcba');

    return NextResponse.json({
      success: true,
      scrapedUrl: targetUrl,
      resolvedSource,
      timestamp: new Date().toISOString(),
      analysis: {
        isWaitlistActive,
        detectedSeverity: status,
        detectedDuration: durationLabel,
        detectedMonths: durationMonths
      },
      database: {
        isWritable: !isVercel,
        didUpdate: dbUpdated,
        activeRecordOnDisk: hcbaWl || null
      },
      logs
    });

  } catch (err: any) {
    logs.push(`❌ Fatal Error during waitlist sync: ${err?.message || err}`);
    return NextResponse.json({
      success: false,
      timestamp: new Date().toISOString(),
      error: err?.message || 'Unknown crawl error',
      logs
    }, { status: 500 });
  }
}
