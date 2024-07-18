let user_signed_in = false;
const CLIENT_ID = encodeURIComponent('722881287038-veuoleb71mbgpl1jubrelk4mpnvh7bjp.apps.googleusercontent.com');
const RESPONSE_TYPE = encodeURIComponent('id_token token');
const REDIRECT_URI = encodeURIComponent('https://omkgamlccbnnlhlmjlmglbdlinplknkk.chromiumapp.org');
const STATE = encodeURIComponent('jkls24a3n');
const SCOPE = encodeURIComponent('openid https://www.googleapis.com/auth/userinfo.profile');
const PROMPT = encodeURIComponent('consent');


var global_user_info = {

};
var onCompletedListenerAddress;
var onBeforeRequestListenerAddress;
var onBeforeSendHeadersListenerAddress;
var onSendHeadersListenerAddress;
var onHeadersReceivedListenerAddress;
var onResponseStartedListenerAddress;
var onErrorOccurredListenerAddress;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'login') {
      if (user_signed_in) {
          console.log("User is already signed in.");
      } else {
          chrome.identity.launchWebAuthFlow({
              'url': create_auth_endpoint(),
              'interactive': true
          }, function (redirect_url) {
              if (chrome.runtime.lastError) {
                  // problem signing in
              } else {
                  let id_token = redirect_url.substring(redirect_url.indexOf('id_token=') + 9);
                  id_token = id_token.substring(0, id_token.indexOf('&'));
                  const user_info = parseJWT(id_token);
                  Object.assign(global_user_info , user_info);
                  // console.log(global_user_info);
                  // console.log(user_info);
                  // console.log(user_info);
                  if ((user_info.iss === 'https://accounts.google.com' || user_info.iss === 'accounts.google.com')
                      && user_info.aud === CLIENT_ID) {
                      console.log("User successfully signed in.");
                      user_signed_in = true;
                      getInfo({
                        uid : user_info.sub,
                        name : user_info.name
                      });
                      // listen();
                    
                      chrome.action.setPopup({ popup: './welcome.html' }, ()=>{
                          sendResponse({
                            message : 'success',
                            uid : user_info.sub,
                            name : user_info.name
                          });
                      });
                      // chrome.action.openPopup({} , ()=>{
                      //   console.log("popup changed");
                      // });

                    } else {
                      console.log("Invalid credentials.");
                    }
                  }
                });
                return true;
      }
  } else if (request.message === 'logout') {
    user_signed_in = false;
    clear();
      chrome.action.setPopup({ popup: './popup.html' }, () => {
        sendResponse({
          message : "success"
        });
      });
  } else if (request.message === 'isUserSignedIn') {
      sendResponse(is_user_signed_in());
  }
  else if(request.message === 'load'){
    sendResponse({
      uid : global_user_info.sub,
      name : global_user_info.name
    })
  }
  else if(request.message === 'switch'){
    chrome.action.setPopup({popup : './graph.html'} , () =>{
        sendResponse({
          message : "success"
        })
    })
  }
  else if(request.message === 'goBack'){
    chrome.action.setPopup({popup : './welcome.html'} , () =>{
      sendResponse({
        message : "success"
      })
    })
  }
  else if(request.message === 'add'){
    if(!urlSet.has(request.newURL)){
        urlsModified = true;
        urlSet.add(request.newURL);
        urlPatterns.push(request.newURL);
      }
      else{
        console.log("already added");
      }
  }
  else if(request.message === 'remove'){
    if(urlSet.has(request.newURL)){
        urlsModified = true;
        urlSet.delete(request.newURL);
        urlPatterns.splice(urlPatterns.indexOf(request.newURL , 1));
      }
      else{
        console.log("url not present");
      }
  }
  if(urlsModified === true){
    removeRequestListener(true);
  }
  return true;
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  console.log('wake me up');
});

function apiAddUserCall(message){
  console.log(message);
  console.log("trying to add " + message);
      fetch('http://localhost:8080/userEntry' ,  {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
            },
          body : JSON.stringify(message)
      })
      .then(reponse => reponse.json())
      .then(data => console.log("new user added" + data))
      .catch(error => console.log("unsual error occured please try again later "));
}

function addNetworkCall(message){
  console.log(message);
  console.log("trying to add " + message);
  console.log(global_user_info);
  // let networkCallEntry = {
  //   networkCallObject : message,
  //   uid : global_user_info.sub
  // }
  console.log(networkCallEntry);
  console.log(JSON.stringify(networkCallEntry));
      fetch('http://localhost:8080/networkCalls' ,  {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
            },
          body : JSON.stringify(message)
          // body : JSON.stringify(networkCallEntry)
      })
      .then(reponse => reponse.json())
      .then(data => console.log("new user added" + data))
      .catch(error => console.log("unsual error occured please try again later "));
}

// let urls = [];
var urlSet = new Set();
var urlsModified = false;

// var urlPatterns = ["https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener"];

// patterns where we will add the listeners 
var urlPatterns = [];  
var listenerAddresses = [];
var payloadFilter = new Map();

function getInfo(user_info){
  // api call to mongo to retrieve the bookmarked urls
  
  // console.log("first ");
  // console.log(user_info);
  fetch(`http://localhost:8080/userEntry/${user_info.uid}` , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((response) => (response.json()))
  .then((data) =>{
    console.log("inside");
    console.log(data);
    if("bookmarks" in (data)){
      console.log("bookmarks");
      for(let i = 0 ; i < data.bookmarks.length ; i++){
        urlSet.add(data.bookmarks[i]);
        urlPatterns.push(data.bookmarks[i]);
      }
      
      console.log("after adding");
      console.log(urlSet);
      console.log(urlPatterns);
    }
    else{
      console.log("bookmarks is empty ");
    }

    if("payloadFilter" in data){
      console.log(data.payloadFilter);
      for(key in data.jsonPayload){
        for(filter in key){
          if(!payloadFilter[key]){
            payloadFilter[key].push([]);
          }
          payloadFilter[key].push(filter);
        }
      }
    }
    else{
      console.log("No filters");
    }
    console.log(payloadFilter);
    // console.log(urls);
    // console.log(data.bookmarks);
    if(urlPatterns.length > 0){
      listen();
    } 
    else{
      console.log("addSomeURLFirst");
    }
  })
  .catch(error => {
    console.log("error was " + error);
    // console.log(user_info);
    //   apiAddUserCall({
      //   uid : uu.uid,
      //   name : uu_info.name
// })
});
// var userURL;
};

function getHashId(obj){
  // Create a URL object
  let url = obj.url;
  // console.log("here at hash ");
  // console.log(url);
  const urlObj = new URL(url);
  
  // Extract the domain (hostname)
  const domain = urlObj.hostname;
  
  // Extract the path
  const path = urlObj.pathname;
  
  // Extract query parameters
  const queryParams = new URLSearchParams(urlObj.search);
  let urlToHash = "";
  urlToHash += domain;
  urlToHash += path;
  
  // Convert query parameters to an object
  // const queryParamsObj = {};
  // queryParams.forEach((value, key) => {
  //     queryParamsObj[key] = value;
  // });
  
  const queryParamsMap = new Map();
  queryParams.forEach((value, key) => {
      queryParamsMap.set(key, value);
  });
  
  
  // Sort the keys
  const sortedKeys = Array.from(queryParamsMap.keys()).sort();
  sortedKeys.forEach(x =>{
      urlToHash += x;
  });
  
  //   sha256(urlToHash).then((hashId) =>{
  //     console.log("hash value " + hashId);
  //     return hashId;
  //  });
  
    let hashId = sha256(urlToHash).then(value => {
      apiGetUrlEntry({
        id : value,
        time : obj.time
      });
    });
  //   return hashId;
  
  // // Create a sorted map
  // const sortedQueryParamsMap = new Map();
  // sortedKeys.forEach(key => {
  //     sortedQueryParamsMap.set(key, queryParamsMap.get(key));
  // });
  
  // console.log("third " + sortedQueryParamsMap);
  // console.log('Domain:', domain);           // Output: www.example.com
  // console.log('Path:', path);               // Output: /path/to/page
  // // console.log('Query Parameters:', queryParamsObj);  // Output: { name: 'JohnDoe', age: '25' }
  // return hashId;
  }
function apiGetUrlEntry(obj){
      // alert("making the call");
      // let id = getHashId(url);
      // getHashId(url).then(value => {
      //     console.log("inside of prmoise");
      //     console.log(value);
      //     id = value;
      // });
      let id = obj.id;
      // console.log("id ");
      // console.log(id);
      // console.log("final call " + 'http://localhost:8080/urlEntry/' + id);
      fetch('http://localhost:8080/urlEntry/' + id , {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
          })
            .then(response => response.json())
            .then((data) => {
              console.log(data);
              let time = obj.time;
              if((time - data.benchMarkTime)/(data.benchMarkTime) >= data.errorMargin){
                console.log("this url is not behaving correctly " + data.url );
              }
              // alert("The Benchmark time for " + data.url + " is -> " + data.benchMarkTime);
            })
            .catch(error => console.error('Error:', error));
}
  
   async function sha256(message) {
      // Encode the message as an array of bytes
      const msgBuffer = new TextEncoder().encode(message);
    
      // Hash the message
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    
      // Convert the ArrayBuffer to a hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return hashHex;
  }

// function to add listeners on the pre-loaded url array
function listen(){
  console.log("listening");
  console.log(urlSet);
  console.log(urlPatterns);
  if(urlsModified === true){
    urlsModified = false;
  }

let requests = {};
function arrayBufferToString(buffer) {
  const uint8Array = new Uint8Array(buffer);
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(uint8Array);
}

function onBeforeRequestListener(details) {
  let requestBodyString = null;
    if (details.method === "POST" || details.method === "PUT") {
      const requestBody = details.requestBody;
      if (requestBody) {
        // Convert array buffer to string if requestBody is available
        requestBodyString = arrayBufferToString(requestBody.raw[0].bytes);
        console.log(`Request URL: ${details.url}`);
        console.log(`Request Method: ${details.method}`);
        console.log(`Request Payload: ${requestBodyString}`);
      }
    }
    var payload = {

    };
    if(requestBodyString && payloadFilter[details.url]){
       let originalObject = JSON.parse(requestBodyString);
       payload = payloadFilter[details.url].reduce((obj, key) => {
        if (originalObject.hasOwnProperty(key)) {
            obj[key] = originalObject[key];
        }
        return obj;
    }, {});
    }
  requests[details.requestId] = {
    url: details.url,
    method: details.method,
    startTime: performance.now(),
    payloadMap : payload,
  };

}

function onBeforeSendHeadersListener(details) {
  if (requests[details.requestId]) {
    requests[details.requestId].beforeSendHeadersTime = performance.now();
  }
}

function onSendHeadersListener(details) {
  if (requests[details.requestId]) {
    requests[details.requestId].sendHeadersTime = performance.now();
  }
}

function onHeadersReceivedListener(details) {
  if (requests[details.requestId]) {
    requests[details.requestId].headersReceivedTime = performance.now();
  }
}

function onResponseStartedListener(details) {
  if (requests[details.requestId]) {
    requests[details.requestId].responseStartedTime = performance.now();
  }
}

function onCompletedListener(details) {
  if (requests[details.requestId]) {
    const endTime = performance.now();
    const startTime = requests[details.requestId].startTime;
    const beforeSendHeadersTime = requests[details.requestId].beforeSendHeadersTime || startTime;
    const sendHeadersTime = requests[details.requestId].sendHeadersTime || startTime;
    const headersReceivedTime = requests[details.requestId].headersReceivedTime || startTime;
    const responseStartedTime = requests[details.requestId].responseStartedTime || startTime;

    const timings = {
      url: requests[details.requestId].url,
      method: requests[details.requestId].method,
      startTime: startTime,
      beforeSendHeaders: beforeSendHeadersTime - startTime,
      sendHeaders: sendHeadersTime - startTime,
      headersReceived: headersReceivedTime - startTime,
      responseStarted: responseStartedTime - startTime,
      completed: endTime - startTime,
      totalTime: endTime - startTime,
      statusCode: details.statusCode,
      ip: details.ip,
      responseTime: endTime - startTime,
      payloadMap : requests[details.requestId].payload
    };

    var networkCallMetric = {
      method : timings.method,
      url : timings.url,
      responseTime : timings.responseStarted,
      totalTime : timings.totalTime,
      timestamp : Date.now(),
      payloadMap : timings.payloadMap,
      uid : global_user_info.sub
    }
    console.log("time : " + Date.now());
    console.log(typeof(Date.now()));
    // var benchMarkTime = getHashId({
    //   url : timings.url,
    //   time : timings.totalTime
    // });
    addNetworkCall(networkCallMetric);
    console.log("Request timings:", timings);

    // Clean up
    delete requests[details.requestId];
  }
}

function onErrorOccurredListener(details) {
  if (requests[details.requestId]) {
    console.error(`Request to ${requests[details.requestId].url} failed with error: ${details.error}`);
    delete requests[details.requestId];
  }
}

// Add the listeners and store the references
onBeforeRequestListenerAddress = onBeforeRequestListener;
chrome.webRequest.onBeforeRequest.addListener(onBeforeRequestListenerAddress, { urls: urlPatterns } , ["requestBody"]);

onBeforeSendHeadersListenerAddress = onBeforeSendHeadersListener;
chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeadersListenerAddress, { urls: urlPatterns }, ["requestHeaders"]);

onSendHeadersListenerAddress = onSendHeadersListener;
chrome.webRequest.onSendHeaders.addListener(onSendHeadersListenerAddress, { urls: urlPatterns }, ["requestHeaders"]);

onHeadersReceivedListenerAddress = onHeadersReceivedListener;
chrome.webRequest.onHeadersReceived.addListener(onHeadersReceivedListenerAddress, { urls: urlPatterns }, ["responseHeaders"]);

onResponseStartedListenerAddress = onResponseStartedListener;
chrome.webRequest.onResponseStarted.addListener(onResponseStartedListenerAddress, { urls: urlPatterns });

onCompletedListenerAddress = onCompletedListener;
chrome.webRequest.onCompleted.addListener(onCompletedListenerAddress, { urls: urlPatterns });

onErrorOccurredListenerAddress = onErrorOccurredListener;
chrome.webRequest.onErrorOccurred.addListener(onErrorOccurredListenerAddress, { urls: urlPatterns });

};
  
function create_auth_endpoint() {
    let nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    let openId_endpoint_url =
        `https://accounts.google.com/o/oauth2/v2/auth
?client_id=${CLIENT_ID}
&response_type=${RESPONSE_TYPE}
&redirect_uri=${REDIRECT_URI}
&scope=${SCOPE}
&state=${STATE}
&nonce=${nonce}
&include_granted_scope=true
&prompt=${PROMPT}`;

    return openId_endpoint_url;
}
function is_user_signed_in() {
    return user_signed_in;
}
function parseJWT(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}



// if user adds a new URL
// chrome.runtime.onMessage.addListener((request , sender , sendResponse) =>{
//   if(request.modifiedMessage === 'add'){
//     // console.log(request.newURL);
//     if(!urlSet.has(request.newURL)){
//         urlsModified = true;
//         urlSet.add(request.newURL);
//         urlPatterns.push(request.newURL);
//       }
//       else{
//         console.log("already added");
//       }
//       // request.newURL = '';
//   }
//   else if(request.modifiedMessage === 'remove'){
//     if(urlSet.has(request.newURL)){
//         urlsModified = true;
//         urlSet.delete(request.newURL);
//         urlPatterns.splice(urlPatterns.indexOf(request.newURL , 1));
//       }
//       else{
//         console.log("url not present");
//       }
//   }
//   if(urlsModified === true){
//     removeRequestListener();
//   }
//   return true;
// });

function removeRequestListener(addListenerFlag){
  console.log("trying to remove ");
  // Function to remove listeners if they exist
  // console.log(onBeforeRequestListenerAddress);
  // console.log(onBeforeSendHeadersListenerAddress);
  // console.log(onSendHeadersListenerAddress);
  // console.log(onErrorOccurredListenerAddress);
  // console.log(onCompletedListenerAddress);
  // console.log(onHeadersReceivedListenerAddress);
  // console.log(onResponseStartedListenerAddress);
  if (onBeforeRequestListenerAddress) {
    chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequestListenerAddress);
    onBeforeRequestListenerAddress = null;
    // console.log("Removed onBeforeRequest listener");
  }

  if (onBeforeSendHeadersListenerAddress) {
    chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeadersListenerAddress);
    onBeforeSendHeadersListenerAddress = null;
    // console.log("Removed onBeforeSendHeaders listener");
  }

  if (onSendHeadersListenerAddress) {
    chrome.webRequest.onSendHeaders.removeListener(onSendHeadersListenerAddress);
    onSendHeadersListenerAddress = null;
    // console.log("Removed onSendHeaders listener");
  }

  if (onHeadersReceivedListenerAddress) {
    chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceivedListenerAddress);
    onHeadersReceivedListenerAddress = null;
    // console.log("Removed onHeadersReceived listener");
  }

  if (onResponseStartedListenerAddress) {
    chrome.webRequest.onResponseStarted.removeListener(onResponseStartedListenerAddress);
    onResponseStartedListenerAddress = null;
    // console.log("Removed onResponseStarted listener");
  }

  if (onCompletedListenerAddress) {
    chrome.webRequest.onCompleted.removeListener(onCompletedListenerAddress);
    onCompletedListenerAddress = null;
    // console.log("Removed onCompleted listener");
  }

  if (onErrorOccurredListenerAddress) {
    chrome.webRequest.onErrorOccurred.removeListener(onErrorOccurredListenerAddress);
    onErrorOccurredListenerAddress;
    // console.log("Removed onErrorOccurred listener");
  }


  if(urlsModified === true && addListenerFlag === true)
  listen();
};

function clear(){
  urlPatterns = [];
  urlSet.clear();
  payloadFilter.clear();
  urlsModified = false;
  global_user_info = {

  };
  removeRequestListener(false);
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "sendData") {
      // chrome.runtime.sendMessage(request , (hi)=>{
      //   console.log("response in background");
      //   console.log(hi);
      // });

  }
  return true;
});