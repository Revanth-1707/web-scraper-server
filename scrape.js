const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const url = process.env.SCRAPE_URL || 'https://example.com';
    console.log(`Scraping URL: ${url}`);

    try {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        await page.goto(url, { waitUntil: 'networkidle2' });

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

        fs.writeFileSync('scraped_data.json', JSON.stringify(data, null, 2));
        console.log('Data scraped and saved to scraped_data.json');
        
        await browser.close();
    } catch (error) {
        console.error('Error during scraping:', error);
        process.exit(1);
    }
})();
