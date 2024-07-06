// function getapi(message){
//   fetch('http://localhost:8080/networkCalls/get' , {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body : JSON.stringify(message)
//   })
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.error('Error:', error));
// };
// chrome.webRequest.onBeforeRequest.addListener(
//   function(details) {
//     if (details.method === "POST" || details.method === "PUT") {
//       const requestBody = details.requestBody;
//       if (requestBody) {
//         // Convert array buffer to string if requestBody is available
//         const requestBodyString = arrayBufferToString(requestBody.raw[0].bytes);
//         console.log(`Request URL: ${details.url}`);
//         console.log(`Request Method: ${details.method}`);
//         console.log(`Request Payload: ${requestBodyString}`);
//       }
//     }
//   },
//   { urls: ["https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener" , "http://localhost:8080/networkCalls/get" ] },
//   ["requestBody"]
// );

// // Function to convert array buffer to string
// function arrayBufferToString(buffer) {
//   const uint8Array = new Uint8Array(buffer);
//   const decoder = new TextDecoder("utf-8");
//   return decoder.decode(uint8Array);
// }

// getapi({
//   urlHash : "d9ffe8407807bb0cd899d6aeaa8c59b72316ac9386ca05400e164467f688a4de",
//   time1 : 1719476989280,
//   time2 : 1719478091252
// });
// {
// let urls = ["https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener" , "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener"];
// const requestDetails = {};

// chrome.webRequest.onBeforeRequest.addListener(
//   function(details) {
//     requestDetails[details.requestId] = {
//       startTime: details.timeStamp,
//       url: details.url
//     };
//   },
//   { urls: urls }
// );

// chrome.webRequest.onSendHeaders.addListener(
//   function(details) {
//     if (requestDetails[details.requestId]) {
//       requestDetails[details.requestId].sendHeadersTime = details.timeStamp;
//     }
//   },
//   { urls: urls },
//   ["requestHeaders"]
// );

// chrome.webRequest.onHeadersReceived.addListener(
//   function(details) {
//     if (requestDetails[details.requestId]) {
//       requestDetails[details.requestId].headersReceivedTime = details.timeStamp;
//     }
//   },
//   { urls: urls},
//   ["responseHeaders"]
// );

// chrome.webRequest.onCompleted.addListener(
//   function(details) {
//     if (requestDetails[details.requestId]) {
//       requestDetails[details.requestId].endTime = details.timeStamp;
//       requestDetails[details.requestId].statusCode = details.statusCode;

//       const metrics = calculateMetrics(requestDetails[details.requestId]);
//       console.log(metrics);
//       delete requestDetails[details.requestId];
//     }
//   },
//   { urls: urls }
// );

// chrome.webRequest.onErrorOccurred.addListener(
//   function(details) {
//     if (requestDetails[details.requestId]) {
//       console.error(`Request failed for ${requestDetails[details.requestId].url}: ${details.error}`);
//       delete requestDetails[details.requestId];
//     }
//   },
//   { urls: urls }
// );

// function calculateMetrics(details) {
//   const startTime = details.startTime;
//   const sendHeadersTime = details.sendHeadersTime || startTime;
//   const headersReceivedTime = details.headersReceivedTime || startTime;
//   const endTime = details.endTime;

//   const totalDuration = endTime - startTime;
//   const networkDuration = sendHeadersTime - startTime;
//   const serverDuration = headersReceivedTime - sendHeadersTime;
//   const downloadDuration = endTime - headersReceivedTime;

//   return {
//     url: details.url,
//     totalDuration: totalDuration.toFixed(2),
//     networkDuration: networkDuration.toFixed(2),
//     serverDuration: serverDuration.toFixed(2),
//     downloadDuration: downloadDuration.toFixed(2),
//     statusCode: details.statusCode
//   };
// }
// }

let socket;
function connectWebSocket() {
    socket = new WebSocket('ws://localhost:8080/ws');

    socket.onopen = function() {
        console.log('WebSocket connection established');
        socket.send('Hello from Chrome Extension');
    };

    socket.onmessage = function(event) {
        let a = (JSON.parse(event.data));
        console.log(a);
    };

    socket.onclose = function() {
        console.log('WebSocket connection closed');
    };

    socket.onerror = function(error) {
        console.error('WebSocket error: ' + error);
    };
}

chrome.runtime.onStartup.addListener(connectWebSocket);
chrome.runtime.onInstalled.addListener(connectWebSocket);


