const puppeteer = require('puppeteer');
const fs = require('fs');

async function generateHar(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Start tracing network requests
  await page.tracing.start({
    path: 'trace.json',
    categories: ['devtools.timeline']
  });

  // Navigate to the URL
  await page.goto(url);

  // Stop tracing
  await page.tracing.stop();

  // Convert trace to HAR
  const har = await page.tracing.getHAR();
  
  // Save HAR file
  fs.writeFileSync('network-log.har', JSON.stringify(har, null, 2));

  await browser.close();
}

// Listener for browser action click
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const url = tabs[0].url;
    generateHar(url);
  });
});

// Event listener for web requests
chrome.webRequest.onCompleted.addListener(
  function(details) {
    console.log('Request completed for URL:', details.url);
    console.log('Response headers:', details.responseHeaders);
    // You can log or process the response headers here
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);
