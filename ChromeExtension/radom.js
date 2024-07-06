

// // // Example usage
// // sha256('example').then(hash => console.log('SHA-256 hash:', hash));

// // const murmurhash3js = require('murmurhash3js');

// // function hashUrl(url) {
// //     // Hash the URL to a 32-bit signed integer
// //     return murmurhash3js.x86.hash32(url);
// // }

// // // Example usage
// // const hashValue = hashUrl(message);
// // console.log(`The hash value of the URL is: ${hashValue}`);

// // async function hashUrlToInteger(url) {
// //     const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(url));
// //     const hexArray = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
// //     const bigIntValue = BigInt('0x' + hexArray);
// //     return bigIntValue.toString(); // Convert BigInt to string without 'n'
// //   }
// //   console.log(hashUrlToInteger("www.youtube.com/watchv"));

// //  hashUrlToInteger(message).then(hashedValue => (console.log(hashedValue)));
// var message = "www.youtube.com/watchv"
// async function sha256(message) {
//   // Encode the message as an array of bytes
//   const msgBuffer = new TextEncoder().encode(message);

//   // Hash the message
//   const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

//   // Convert the ArrayBuffer to a hex string
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
//   return hashHex;
// }
// (sha256(url).then((response) => console.log(response)));
// // function networkCallEntry(message){
// //   console.log(message);
// //   console.log("trying to add " + message);
// //       fetch('http://localhost:8080/networkCalls' ,  {
// //           method: 'POST',
// //           headers: {
// //               'Content-Type': 'application/json'
// //             },
// //           body : JSON.stringify(message)
// //       })
// //       .then(reponse => reponse.json())
// //       .then(data => console.log("new user added" + data))
// //       .catch(error => console.log("unsual error occured please try again later "));
// // }

// // var one = "5fb00da58c17f1c406290210b45ac505fb25528b9f935a23ba7ab12fdfb8c3de";
// // var two = "5fb00da58c17f1c406290210b45ac505fb25528b9f935a23ba7ab12fdfb8c3de";
// // if(one === two){
// //   console.log("lets go");
// // }

// // // Example URL
// var url = 'https://www.example.com/path/to/page?name=JohnDoe&age=25&agee=23';

// // // Create a URL object
// // const urlObj = new URL(url);

// // // Extract the domain (hostname)
// // const domain = urlObj.hostname;

// // // Extract the path
// // const path = urlObj.pathname;

// // // Extract query parameters
// // const queryParams = new URLSearchParams(urlObj.search);

// // // Convert query parameters to an object
// // const queryParamsObj = {};
// // queryParams.forEach((value, key) => {
// //     queryParamsObj[key] = value;
// // });

// // console.log('Domain:', domain);           // Output: www.example.com
// // console.log('Path:', path);               // Output: /path/to/page
// // console.log('Query Parameters:', queryParamsObj);  // Output: { name: 'JohnDoe', age: '25' }



// function apiGetUrlEntry(url){
//   // Create a URL object
// const urlObj = new URL(url);

// // Extract the domain (hostname)
// const domain = urlObj.hostname;

// // Extract the path
// const path = urlObj.pathname;

// // Extract query parameters
// const queryParams = new URLSearchParams(urlObj.search);
// let urlToHash = "";
// urlToHash += domain;
// urlToHash += path;

// // Convert query parameters to an object
// // const queryParamsObj = {};
// // queryParams.forEach((value, key) => {
// //     queryParamsObj[key] = value;
// // });

// const queryParamsMap = new Map();

// queryParams.forEach((value, key) => {
//   // console.log(key + " : " + value);
//   queryParamsMap.set(key, value);
// });
// console.log("first " + queryParams);

// // Sort the keys
// const sortedKeys = Array.from(queryParamsMap.keys()).sort();
// console.log("second ");
// sortedKeys.forEach(x => {
//   console.log(x);
// });




// // console.log("third " + sortedQueryParamsMap);
// console.log('Domain:', domain);           // Output: www.example.com
// console.log('Path:', path);               // Output: /path/to/page
// // console.log('Query Parameters:', queryParamsObj);  // Output: { name: 'JohnDoe', age: '25' }
// }
// apiGetUrlEntry(url);



// let a = 
// {
//   "query": {
//     "bool": {
//       "must": [
//         {
//           "term": {
//             "urlHash.keyword": "d9ffe8407807bb0cd899d6aeaa8c59b72316ac9386ca05400e164467f688a4de"
//           }
//         },
//         {
//           "range": {
//             "timestamp": {
//               "gte": 1719476989280,
//               "lte": 1719478091252,
//               "format": "epoch_millis"
//             }
//           }
//         }
//       ]
//     }
//   },
//   "aggs": {
//     "average_response_time": {
//       "avg": {
//         "field": "callMetrics.responseTime"
//       }
//     }
//   },
//   "size": 0  
// }

// let d = new Date(parseInt("1720013024037"));
// console.log(d.toString());

// let data = {
//     uid: "123245",
//     name: "Manasvi",
//     bookmarks: [
//         "www.google.com",
//         "www.facebook.com",
//         "www.yahoo.com"
//     ],
//     payloadFilter: {"google" : ["value" , "one" , "two" , "three"] , "facebook" : ["four" , "five" , "six"]}
// }
// if("payloadFilter" in data){
//     console.log(data.payloadFilter);
//     for(key in data.jsonPayload){
//       for(filter in key){
//         if(!payloadFilter[key]){
//           payloadFilter[key].push([]);
//         }
//         payloadFilter[key].push(filter);
//       }
//     }
//   }
//   else{
//     console.log("No filters");
//   }
// var payload = {

// };
// let fieldsToFilter = ["time1" , "time2" , "time3"];
// requestBodyString = "{\"urlHash\":\"d9ffe8407807bb0cd899d6aeaa8c59b72316ac9386ca05400e164467f688a4de\",\"time1\":\"1719476989280\",\"time2\":\"1719478091252\"}";
// if(requestBodyString){
//     let originalObject = JSON.parse(requestBodyString);
//     payload = fieldsToFilter.reduce((obj, key) => {
//      if (originalObject.hasOwnProperty(key)) {
//         console.log(key + " : " +  originalObject[key]);
//          obj[key] = originalObject[key];
//      }
//      return obj;
//  }, {});
// }
// for(let key in payload){
//     console.log(key);
//     console.log(payload[key]);
// }

let url = [
        { urlMatches: "https://example.com/*", methods: ["GET", "POST"] },
        { urlMatches: "https://another.example.com/*", methods: ["POST"] },
        { urlMatches: "https://third.example.com/api/*", methods: ["GET", "PUT"] }
]
console.log(typeof(url));
console.log(url);
console.log(typeof(url[0]));
console.log(url[0]);