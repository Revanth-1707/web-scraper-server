# 🚀 Web Scraper & Server with Node.js, Puppeteer, and Flask

This project demonstrates a Dockerized solution that:
1. Uses **Node.js with Puppeteer** to scrape a user-specified URL
2. Serves the scraped data via a **Python Flask** web server
3. Utilizes **multi-stage Docker builds** for a lean production image

## 📦 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your system
- Git (to clone the repository)

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/web-scraper-server.git
   cd web-scraper-server
   ```

## 🏗️ Building the Docker Image

### Option 1: Build with default URL (scrapes example.com)
```bash
docker build -t web-scraper-server .
```

### Option 2: Build with custom URL
```bash
docker build --build-arg SCRAPE_URL=https://your-target-url.com -t web-scraper-server .
```

## 🚀 Running the Container

```bash
docker run -d -p 5000:5000 web-scraper-server
```

## 🌐 Accessing the Scraped Data

After running the container, access the scraped data in JSON format at:
```
http://localhost:5000
```

Or via curl:
```bash
curl http://localhost:5000
```

## 🧩 Project Structure

```
web-scraper-server/
├── Dockerfile             # Multi-stage Docker configuration
├── scrape.js             # Puppeteer scraping script
├── server.py             # Flask web server
├── package.json          # Node.js dependencies
├── requirements.txt      # Python dependencies
└── README.md             # This file
```

## 🔧 How It Works

1. **Scraper Stage (Node.js)**:
   - Uses Puppeteer with system-installed Chromium
   - Extracts:
     - Page title
     - All h1 and h2 headings
     - Meta tags
     - Scraping timestamp
   - Saves data to `scraped_data.json`

2. **Server Stage (Python)**:
   - Lightweight Flask server
   - Serves the scraped data as JSON
   - Runs on port 5000

## 🐛 Troubleshooting

1. **If you get Docker permission errors**:
   ```bash
   sudo usermod -aG docker $USER
   ```
   Then log out and back in.

2. **To view container logs**:
   ```bash
   docker logs <container-id>
   ```

3. **To stop the container**:
   ```bash
   docker stop <container-id>
   ```

4. **If you need to scrape a new URL**:
   - Rebuild the image with the new URL:
     ```bash
     docker build --build-arg SCRAPE_URL=https://new-url.com -t web-scraper-server .
     ```
   - Then run the container again

