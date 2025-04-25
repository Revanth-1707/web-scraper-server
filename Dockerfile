# Stage 1: Node.js scraper stage
FROM node:18-slim AS scraper


RUN apt-get update && \
    apt-get install -y wget gnupg && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*


ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /app


COPY package.json .
RUN npm install


COPY scrape.js .


ARG SCRAPE_URL=https://example.com
ENV SCRAPE_URL=$SCRAPE_URL


RUN node scrape.js

# Stage 2: Python hosting stage
FROM python:3.10-slim

WORKDIR /app


COPY --from=scraper /app/scraped_data.json .


COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


COPY server.py .


EXPOSE 5000
CMD ["python", "server.py"]
