
//   let mp = new Map();
//   mp["youtube.com"] = 1;
//   console.log(mp["youtube.com"]);

//   function testCollisions() {
//     let collisions = {};
//     for (let i = 0; i < 1000000; i++) {
//       let str = Math.random().toString(36).substring(2, 15);
//       let hashValue = simpleHash(str);
//       if (collisions[hashValue]) {
//         console.log(`Collision found: ${str} and ${collisions[hashValue]}`);
//         return;
//       }
//       collisions[hashValue] = str;
//     }
//     console.log("No collisions found in 1,000,000 iterations");
//   }
  
//   testCollisions();




//   var onBeforeRequestListenerAddress;
// var onBeforeSendHeadersListenerAddress;
// var onSendHeadersListenerAddress;
// var onHeadersReceivedListenerAddress;
// var onResponseStartedListenerAddress;
// var onCompletedListenerAddress;
// var onErrorOccurredListenerAddress;

// var requests = {}; // assuming you have this object to store request details
// var urlPatterns = ["<your-URL-patterns>"]; // specify your URL patterns here

// // Define the listener functions
// function onBeforeRequestListener(details) {
//   requests[details.requestId] = {
//     url: details.url,
//     method: details.method,
//     startTime: performance.now(),
//   };
// }

// function onBeforeSendHeadersListener(details) {
//   if (requests[details.requestId]) {
//     requests[details.requestId].beforeSendHeadersTime = performance.now();
//   }
// }

// function onSendHeadersListener(details) {
//   if (requests[details.requestId]) {
//     requests[details.requestId].sendHeadersTime = performance.now();
//   }
// }

// function onHeadersReceivedListener(details) {
//   if (requests[details.requestId]) {
//     requests[details.requestId].headersReceivedTime = performance.now();
//   }
// }

// function onResponseStartedListener(details) {
//   if (requests[details.requestId]) {
//     requests[details.requestId].responseStartedTime = performance.now();
//   }
// }

// function onCompletedListener(details) {
//   if (requests[details.requestId]) {
//     const endTime = performance.now();
//     const startTime = requests[details.requestId].startTime;
//     const beforeSendHeadersTime = requests[details.requestId].beforeSendHeadersTime || startTime;
//     const sendHeadersTime = requests[details.requestId].sendHeadersTime || startTime;
//     const headersReceivedTime = requests[details.requestId].headersReceivedTime || startTime;
//     const responseStartedTime = requests[details.requestId].responseStartedTime || startTime;

//     const timings = {
//       url: requests[details.requestId].url,
//       method: requests[details.requestId].method,
//       startTime: startTime,
//       beforeSendHeaders: beforeSendHeadersTime - startTime,
//       sendHeaders: sendHeadersTime - startTime,
//       headersReceived: headersReceivedTime - startTime,
//       responseStarted: responseStartedTime - startTime,
//       completed: endTime - startTime,
//       totalTime: endTime - startTime,
//       statusCode: details.statusCode,
//       ip: details.ip,
//       responseTime: endTime - startTime,
//     };

//     console.log("Request timings:", timings);

//     // Clean up
//     delete requests[details.requestId];
//   }
// }

// function onErrorOccurredListener(details) {
//   if (requests[details.requestId]) {
//     console.error(`Request to ${requests[details.requestId].url} failed with error: ${details.error}`);
//     delete requests[details.requestId];
//   }
// }

// // Add the listeners and store the references
// onBeforeRequestListenerAddress = onBeforeRequestListener;
// chrome.webRequest.onBeforeRequest.addListener(onBeforeRequestListenerAddress, { urls: urlPatterns });

// onBeforeSendHeadersListenerAddress = onBeforeSendHeadersListener;
// chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeadersListenerAddress, { urls: urlPatterns }, ["requestHeaders"]);

// onSendHeadersListenerAddress = onSendHeadersListener;
// chrome.webRequest.onSendHeaders.addListener(onSendHeadersListenerAddress, { urls: urlPatterns }, ["requestHeaders"]);

// onHeadersReceivedListenerAddress = onHeadersReceivedListener;
// chrome.webRequest.onHeadersReceived.addListener(onHeadersReceivedListenerAddress, { urls: urlPatterns }, ["responseHeaders"]);

// onResponseStartedListenerAddress = onResponseStartedListener;
// chrome.webRequest.onResponseStarted.addListener(onResponseStartedListenerAddress, { urls: urlPatterns });

// onCompletedListenerAddress = onCompletedListener;
// chrome.webRequest.onCompleted.addListener(onCompletedListenerAddress, { urls: urlPatterns });

// onErrorOccurredListenerAddress = onErrorOccurredListener;
// chrome.webRequest.onErrorOccurred.addListener(onErrorOccurredListenerAddress, { urls: urlPatterns });

// // Function to remove all listeners
// function removeListeners() {
//   if (onBeforeRequestListenerAddress) {
//     chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequestListenerAddress);
//   }
//   if (onBeforeSendHeadersListenerAddress) {
//     chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeadersListenerAddress);
//   }
//   if (onSendHeadersListenerAddress) {
//     chrome.webRequest.onSendHeaders.removeListener(onSendHeadersListenerAddress);
//   }
//   if (onHeadersReceivedListenerAddress) {
//     chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceivedListenerAddress);
//   }
//   if (onResponseStartedListenerAddress) {
//     chrome.webRequest.onResponseStarted.removeListener(onResponseStartedListenerAddress);
//   }
//   if (onCompletedListenerAddress) {
//     chrome.webRequest.onCompleted.removeListener(onCompletedListenerAddress);
//   }
//   if (onErrorOccurredListenerAddress) {
//     chrome.webRequest.onErrorOccurred.removeListener(onErrorOccurredListenerAddress);
//   }
// }

// let a = "1719583179984";
//     const date = new Date(Number(a));
//             const humanReadableDate = date.toLocaleString();
// console.log(humanReadableDate);


const queryKeys = ["crid", "i", "k", "qid"];
const n = queryKeys.length;

// Create the should clauses
const shouldClauses = queryKeys.map(key => ({
  nested: {
    path: "query",
    query: {
      bool: {
        must: [
          { match: { "query.query": key } }
        ]
      }
    }
  }
}));

// Construct the final query
const kibanaQuery = {
  query: {
    bool: {
      should: shouldClauses,
      minimum_should_match: Math.max(1, n - 2) // Adjust to n-1 or n-2 as needed
    }
  }
};

console.log(JSON.stringify(kibanaQuery, null, 2));