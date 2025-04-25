const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    // Get URL from environment variable
    const url = process.env.SCRAPE_URL || 'https://example.com';
    console.log(`Scraping URL: ${url}`);

    try {
        // Launch browser
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Navigate to URL
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        // Extract data
        const data = {
            url: url,
            title: await page.title(),
            headings: {
                h1: await page.$$eval('h1', els => els.map(el => el.textContent.trim())),
                h2: await page.$$eval('h2', els => els.map(el => el.textContent.trim()))
            },
            metadata: await page.evaluate(() => {
                const metaTags = {};
                document.querySelectorAll('meta').forEach(tag => {
                    const name = tag.getAttribute('name') || tag.getAttribute('property');
                    if (name) {
                        metaTags[name] = tag.getAttribute('content');
                    }
                });
                return metaTags;
            }),
            scrapedAt: new Date().toISOString()
        };
        
        // Save data to file
        fs.writeFileSync('scraped_data.json', JSON.stringify(data, null, 2));
        console.log('Data scraped and saved to scraped_data.json');
        
        await browser.close();
    } catch (error) {
        console.error('Error during scraping:', error);
        process.exit(1);
    }
})();