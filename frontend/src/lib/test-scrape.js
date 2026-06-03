/* eslint-disable */
const https = require('https');


function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, html: data }));
    }).on('error', reject);
  });
}

async function main() {
  const url = 'https://www.dgs.ca.gov/OAH/Case-Types/Special-Education/Resources/Advocate-List';
  const res = await fetchUrl(url);
  
  const searchStr = 'www.kairosadvocates.org';
  const index = res.html.indexOf(searchStr);
  console.log("Found search string at index:", index);
  if (index !== -1) {
    console.log("HTML snippet around search string:");
    console.log(res.html.substring(index - 1000, index + 1000));
  }
}

main().catch(console.error);
