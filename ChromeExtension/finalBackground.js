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
                    
                      chrome.action.setPopup({ popup: './welcomeStyled.html' }, ()=>{
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
    clear(true);
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
    chrome.action.setPopup({popup : './welcomeStyled.html'} , () =>{
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
  else if(request.message === 'timed_out'){
    console.log("we got timed out");
    clear(true);
      chrome.action.setPopup({popup : './popup.html' });
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

// chrome.runtime.onInstalled.addListener(function() {
  // This is just for demonstration; you can send the message based on your conditions
  
// });
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
      .then(data => {
        console.log("new user added");
        console.log(data);
      })
      .catch(error => console.log("unsual error occured please try again later "));
}

function addNetworkCall(message){
  // console.log(message);
  console.log("trying to add ");
  console.log(message);
  // console.log(JSON.stringify(message));
  console.log(global_user_info);
  // let networkCallEntry = {
  //   networkCallObject : message,
  //   uid : global_user_info.sub
  // }
  // console.log(networkCallEntry);
  // console.log(JSON.stringify(networkCallEntry));
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
      .catch(error => console.log("Failed Validation Call not Tracked by the user " + error));
}
// adding to chrome storage 
// Function to add object to array1
async function addObjectToBenchmarkFailed(newObject) {
  await chrome.storage.local.get(['benchmarkFailed'], function(result) {
      let array1 = result.benchmarkFailed || [];
      array1.push(newObject);

      chrome.storage.local.set({ benchmarkFailed: array1 }, function() {
          console.log('New object added to array1.');
      });
  });
}

// Function to add object to array2
async function addObjectToValidationFailed(newObject) {
  chrome.storage.local.get(['validationFailed'], function(result) {
      let array2 = result.validationFailed || [];
      array2.push(newObject);

      chrome.storage.local.set({ validationFailed : array2 }, function() {
          console.log('New object added to array2.');
      });
  });
}

// // Function to retrieve both arrays
// function retrieveArrays() {
//   chrome.storage.local.get(['benchmarkFailed', 'validationFailed'], function(result) {
//       let benchmarkFailed = result.benchmarkFailed || [];
//       let validationFailed = result.validationFailed || [];

//       console.log('Retrieved array1:', benchmarkFailed);
//       console.log('Retrieved array2:', validationFailed);
//   });
// }





/*

  {
            url: "https://example.com/api/v1/resource1",
            missingQueryParams: ["param1", "param3"],
            missingPayload: ["key1", "key3"],
  }

*/
// Example usage
// let newObject1 = { id: 5, name: "NewObject1" };
// let newObject2 = { id: 6, name: "NewObject2" };

// addObjectToBenchmarkFailed(newObject1);
// addObjectToValidationFailed(newObject2);
// chrome.storage.local.clear();

// web Socket 
let socket;
function connectWebSocket() {
    socket = new WebSocket('ws://localhost:8080/ws');

    socket.onopen = function() {
        console.log('WebSocket connection established');
        socket.send('Hello from Chrome Extension');
    };

    socket.onmessage = async function(event) {
        let a = (JSON.parse(event.data));
        console.log("MESSAGE RECERIVED");
        console.log(a);
        if(a.message == "validationFailed"){
            let message = {
                message : "validationFailed",
                id : a.id,
                networkCallEntry : a.networkCallEntry,
                url : a.networkCallEntry.url,
                missingQueryParams : a.badQueries,
                missingPayload : a.badPayloadList
            };
             await addObjectToValidationFailed(message);
              chrome.runtime.sendMessage({
                message : "validationFailed"
              } , response => {
                // we will create notification
                chrome.notifications.create({
                  type: 'basic',
                  iconUrl: 'icon.png',
                  title: 'Alert!',
                  message: 'You just made Network Call which failed Validation'
              }, function(notificationId) {
                  console.log('Notification shown', notificationId);
              });
              })
        }else if(a.message == "benchmarkFailed"){

          /*{
  url: "https://example.com/api/v1/resource1",
  query: { param1: "value1", param2: "value2" },
  payloadMap: { key1: "data1", key2: "data2" },
  callMetrics: { responseTime: 1300 },
  extraQueryParams : [{key : "value",
  value : "key"}],
  differentQueryParams : [{key : "value",
  value : "key"}],
  idealCall: {
    url: "https://example.com/api/v1/resource",
    query: { param1: "value1", param2: "value2" },
    payloadMap: { key1: "data1", key2: "data2" },
    callMetrics: { responseTime: 1000 },
  },
}*/
            if(a.error == "identical"){
                let message = {
                    error : a.error,
                    id : a.id,
                    url : a.networkCallEntry.url,
                    query : a.networkCallEntry.query,
                    payloadMap : a.networkCallEntry.payloadMap,
                    callMetrics : {
                      responseTime : a.networkCallEntry.callMetrics.responseTime
                    },
                    timestamp : a.networkCallEntry.timestamp,
                    extraQueryParams : [],
                    differentQueryParams : [],
                    idealCallEntry : {
                    url : a.idealCallEntry.url,
                    query : a.idealCallEntry.query,
                    payloadMap : a.idealCallEntry.payloadMap,
                    callMetrics : {
                      responseTime : a.idealCallEntry.callMetrics.responseTime
                    }
                    }
                };
                await addObjectToBenchmarkFailed(message)
                  chrome.runtime.sendMessage({
                    message : "benchmarkFailed"
                  } , response => {
                    // we will create notification
                    chrome.notifications.create({
                      type: 'basic',
                      iconUrl: 'icon.png',
                      title: 'Alert!',
                      message: 'A Network Call deviated significantly from the benchmark'
                  }, function(notificationId) {
                      console.log('Notification shown', notificationId);
                  });
                  })

            }else if(a.error == "extraQuery"){
              let message = {
                error : a.error,
                id : a.id,
                url : a.networkCallEntry.url,
                query : a.networkCallEntry.query,
                payloadMap : a.networkCallEntry.payloadMap,
                callMetrics : {
                  responseTime : a.networkCallEntry.callMetrics.responseTime
                },
                timestamp : a.networkCallEntry.timestamp,
                extraQueryParams : a.extraQueryParams,
                differentQueryParams : a.differentQueryParams,
                idealCallEntry : {
                url : a.idealCallEntry.url,
                query : a.idealCallEntry.query,
                payloadMap : a.idealCallEntry.payloadMap,
                callMetrics : {
                  responseTime : a.idealCallEntry.callMetrics.responseTime
                }
                }
            };
                await addObjectToBenchmarkFailed(message);
                  chrome.runtime.sendMessage({
                    message : "benchmarkFailed"
                  } , response => {
                    // we will create notification
                    chrome.notifications.create({
                      type: 'basic',
                      iconUrl: 'icon.png',
                      title: 'Alert!',
                      message: 'A Network Call deviated significantly from the benchmark'
                  }, function(notificationId) {
                      console.log('Notification shown', notificationId);
                  });
                  })
            }else if(a.error == "differentQueryValues"){
              let message = {
                error : a.error,
                id : a.id,
                url : a.networkCallEntry.url,
                query : a.networkCallEntry.query,
                payloadMap : a.networkCallEntry.payloadMap,
                timestamp : a.networkCallEntry.timestamp,
                callMetrics : {
                  responseTime : a.networkCallEntry.callMetrics.responseTime
                },
                extraQueryParams : a.extraQueryParams,
                differentQueryParams : a.differentQueryParams,
                idealCallEntry : {
                url : a.idealCallEntry.url,
                query : a.idealCallEntry.query,
                payloadMap : a.idealCallEntry.payloadMap,
                callMetrics : {
                  responseTime : a.idealCallEntry.callMetrics.responseTime
                }
                }
            
              };
                await addObjectToBenchmarkFailed(message)
                  chrome.runtime.sendMessage({
                    message : "benchmarkFailed"
                  } , response => {
                    // we will create notification
                    chrome.notifications.create({
                      type: 'basic',
                      iconUrl: 'icon.png',
                      title: 'Alert!',
                      message: 'A Network Call deviated significantly from the benchmark'
                  }, function(notificationId) {
                      console.log('Notification shown', notificationId);
                  });
                  })
            }
        }
    };

    socket.onclose = function() {
        console.log('WebSocket connection closed');
        connectWebSocket();
    };

    socket.onerror = function(error) {
      // connectWebSocket();
        console.error('WebSocket error: ' + error);
    };
    // console.log("infinite");
    // connectWebSocket();
}
connectWebSocket();


// this will maintain the count for each simple URL 
var urlSet = new Map();
var urlsModified = false;

// var urlPatterns = ["https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener"];

// patterns where we will add the listeners 
var urlPatterns = [];  

// listener Addresses 
var listenerAddresses = [];

// urlPatterns hashed and will act as key for finding methods to track
var urlPatternsHashed = [];

// urlPatterns with methods hashed and will act as key for finding payload to filter
var urlPatternsWithMethodHashed = [];
// maintaining the count like url 
var methodTrackingCount = new Map();
// payload Filter count like url and method
var payloadFilterCount = new Map();
// payload to track for each urlMethodHashed value
var payloadFilter = new Map();
// methods to track for each urlHashed value 
var methodsToTrack = new Map();

async function removeURL(newEntry)
{
  // if url is removed -> we need to remove from urlPatterns , methodsToTrack , payload 
  console.log("new Entry ");
  console.log(newEntry);
  // userUrl
  // simple url to add to tracker 
  let simpleURL = await newEntry.simpleUrl;
  let simpleURLHashed = await newEntry.simpleUrlHashed;
  let methodsTrackingForThisUrl = await methodsToTrack[simpleURLHashed];
  let payloadTrackingForThisUrl = await payloadFilter[simpleURLHashed];

  console.log("methods we are tracking for " + simpleURL);
  console.log(methodsTrackingForThisUrl);
  console.log("payload we are tracking for this url");
  console.log(payloadTrackingForThisUrl);
  // lets remove url completely 
  urlSet[simpleURLHashed]--;
  if(urlSet[simpleURLHashed] == 0){
    console.log("urlSet");
    console.log(urlSet)
    console.log("simpleUrl : " + simpleURL + " simpleUrlHashed : " + simpleURLHashed);
    // urlSet[simpleURLHashed] = 0;
    // we removed it from url Patterns
    urlPatterns = urlPatterns.filter(item => item !== simpleURL);
  
  }
  // urlSet[simpleURLHashed]++;
  // if(!methodsToTrack[simpleURLHashed]){
  //   methodsToTrack[simpleURLHashed] = new Set();
  // }
  // if(!methodTrackingCount[simpleURLHashed]){
  //   methodTrackingCount[simpleURLHashed] = new Map();
  // }
  console.log("removing each method");
  Object.entries(methodsTrackingForThisUrl).forEach(item =>{
    console.log(item);
    methodTrackingCount[simpleURLHashed][item]--;
    if(methodTrackingCount[simpleURLHashed][item] == 0){
      methodsToTrack[simpleURLHashed].delete(item);
    }
    console.log(methodTrackingCount)[simpleURLHashed];
    console.log(methodsToTrack[simpleURLHashed]);
    // methodTrackingCount[simpleURLHashed][item]++;
    // methodsToTrack[simpleURLHashed].add(item);
  })
  
  // if(newEntry.postPayloadFilters && newEntry.postPayloadFilters.length > 0){
    // if(!(payloadFilter[simpleURLHashed])){
    //   payloadFilter[simpleURLHashed] = new Map();
    // }
    // if(!payloadFilterCount[simpleURLHashed]){
    //   payloadFilterCount[simpleURLHashed] = new Map();
    // }
    // if(!payloadFilterCount[simpleURLHashed]["POST"]){
    //   payloadFilterCount[simpleURLHashed]["POST"] = new Map();
    // }
    // if(!payloadFilter[simpleURLHashed]["POST"]){
    //   payloadFilter[simpleURLHashed]["POST"] = new Map();
    // }
    console.log("post filters");
    if(payloadTrackingForThisUrl && payloadTrackingForThisUrl["POST"]){

    
    Object.entries(payloadTrackingForThisUrl["POST"]).forEach(item =>{
      console.log(items);
      if(payloadFilterCount[simpleURLHashed]["POST"][item]){

      }else{
        payloadFilterCount[simpleURLHashed]["POST"][item] = 1;
      }
      payloadFilterCount[simpleURLHashed]["POST"][item]--;
      if(payloadFilterCount[simpleURLHashed]["POST"][item] == 0)
        {
          payloadFilter[simpleURLHashed]["POST"].delete(item);
        }
        console.log(payloadFilterCount[simpleURLHashed]);
        console.log(payloadFilter[simpleURLHashed]);
      // payloadFilterCount[simpleURLHashed]["POST"][item]++;
      // payloadFilter[simpleURLHashed]["POST"].add(item);
    })
  }
  // }
  // if(newEntry.putPayloadFilters && newEntry.putPayloadFilters.length > 0){
    // if(!(payloadFilter[simpleURLHashed])){
    //   payloadFilter[simpleURLHashed] = new Map();
    // }
    // if(!payloadFilterCount[simpleURLHashed]){
    //   payloadFilterCount[simpleURLHashed] = new Map();
    // }
    // if(!payloadFilterCount[simpleURLHashed]["POST"]){
    //   payloadFilterCount[simpleURLHashed]["POST"] = new Map();
    // }
    // if(!payloadFilter[simpleURLHashed]["POST"]){
    //   payloadFilter[simpleURLHashed]["POST"] = new Map();
    // }
    console.log("put filters");
    if(payloadTrackingForThisUrl && payloadTrackingForThisUrl["PUT"]){ 
    Object.entries(payloadTrackingForThisUrl["PUT"]).forEach(item =>{
      console.log(item);
      if(payloadFilterCount[simpleURLHashed]["PUT"][item]){

      }else{
        payloadFilterCount[simpleURLHashed]["PUT"][item] = 1;
      }
      payloadFilterCount[simpleURLHashed]["PUT"][item]--;
      if(payloadFilterCount[simpleURLHashed]["PUT"][item] == 0)
        {
          payloadFilter[simpleURLHashed]["PUT"].delete(item);
        }
        console.log(payloadFilterCount[simpleURLHashed]);
        console.log(payloadFilter[simpleURLHashed]);
      // payloadFilterCount[simpleURLHashed]["POST"][item]++;
      // payloadFilter[simpleURLHashed]["POST"].add(item);
    })
  }
  // }
  urlsModified = true;
  removeRequestListener(true);
}

async function removeMethod(newEntry){
    // if method is removed -> we need to remove from  methodsToTrack , payload 
    console.log("new Entry ");
    console.log(newEntry);
    // simple url to add to tracker 
    let simpleURL = await newEntry.simpleUrl;
    let method = await newEntry.method;
    let simpleURLHashed = await newEntry.simpleUrlHashed;
    let methodsTrackingForThisUrl = await methodsToTrack[simpleURLHashed];
    let payloadTrackingForThisUrl = await payloadFilter[simpleURLHashed];
    console.log("methodsTrackingFoor this" + simpleURL);
    console.log(methodsTrackingForThisUrl);
    console.log("payloadtracking this" + simpleURL);
    console.log(payloadTrackingForThisUrl);
    
    // lets remove url completely 
    // urlSet[simpleURLHashed]--;
    // if(urlSet[simpleURLHashed] == 0){
    //   console.log("urlSet");
    //   console.log(urlSet)
    //   console.log("simpleUrl : " + simpleURL + " simpleUrlHashed : " + simpleURLHashed);
    //   // urlSet[simpleURLHashed] = 0;
    //   // we removed it from url Patterns
    //   urlPatterns = urlPatterns.filter(item => item !== simpleURL);
    // }
    // urlSet[simpleURLHashed]++;
    // if(!methodsToTrack[simpleURLHashed]){
    //   methodsToTrack[simpleURLHashed] = new Set();
    // }
    // if(!methodTrackingCount[simpleURLHashed]){
    //   methodTrackingCount[simpleURLHashed] = new Map();
    // }
    methodTrackingCount[simpleURLHashed][method]--;
    if(methodTrackingCount[simpleURLHashed][method]== 0){
      methodsToTrack[simpleURLHashed].delete(method);
    }
    // Object.entries(methodsTrackingForThisUrl).forEach(item =>{
    //   methodTrackingCount[simpleURLHashed][item]--;
    //   if(methodTrackingCount[simpleURLHashed][item] == 0){
    //   }
    //   // methodTrackingCount[simpleURLHashed][item]++;
    //   // methodsToTrack[simpleURLHashed].add(item);
    // })
    
    if(method == "POST"){
      // if(!(payloadFilter[simpleURLHashed])){
      //   payloadFilter[simpleURLHashed] = new Map();
      // }
      // if(!payloadFilterCount[simpleURLHashed]){
      //   payloadFilterCount[simpleURLHashed] = new Map();
      // }
      // if(!payloadFilterCount[simpleURLHashed]["POST"]){
      //   payloadFilterCount[simpleURLHashed]["POST"] = new Map();
      // }
      // if(!payloadFilter[simpleURLHashed]["POST"]){
      //   payloadFilter[simpleURLHashed]["POST"] = new Map();
      // }

      console.log("removing post paylods ")
      if(payloadTrackingForThisUrl && payloadTrackingForThisUrl["POST"]){
        
        Object.entries(payloadTrackingForThisUrl["POST"]).forEach(item =>{
          console.log(item);
          // if(payloadFilterCount[simpleURLHashed]["POST"][item]){
    
          // }else{
          //   payloadFilterCount[simpleURLHashed]["POST"][item] = 0;
          // }

          payloadFilterCount[simpleURLHashed]["POST"][item]--;
          if(payloadFilterCount[simpleURLHashed]["POST"][item] == 0)
            {
              payloadFilter[simpleURLHashed]["POST"].delete(item);
            }
            console.log(payloadFilterCount[simpleURLHashed]);
            console.log(payloadFilter[simpleURLHashed]);
          // payloadFilterCount[simpleURLHashed]["POST"][item]++;
          // payloadFilter[simpleURLHashed]["POST"].add(item);
        })
      }
      
    }
    if(method == "PUT"){
      console.log("removing putPaylods");
      // if(!(payloadFilter[simpleURLHashed])){
      //   payloadFilter[simpleURLHashed] = new Map();
      // }
      // if(!payloadFilterCount[simpleURLHashed]){
      //   payloadFilterCount[simpleURLHashed] = new Map();
      // }
      // if(!payloadFilterCount[simpleURLHashed]["POST"]){
      //   payloadFilterCount[simpleURLHashed]["POST"] = new Map();
      // }
      // if(!payloadFilter[simpleURLHashed]["POST"]){
      //   payloadFilter[simpleURLHashed]["POST"] = new Map();
      // }
      if(payloadTrackingForThisUrl && payloadTrackingForThisUrl["PUT"]){

      Object.entries(payloadTrackingForThisUrl["PUT"]).forEach(item =>{
        console.log(item);
        // if(payloadFilterCount[simpleURLHashed]["PUT"][item]){
  
        // }else{
        //   payloadFilterCount[simpleURLHashed]["PUT"][item] = 0;
        // }
        payloadFilterCount[simpleURLHashed]["PUT"][item]--;
        if(payloadFilterCount[simpleURLHashed]["PUT"][item] == 0)
          {
            payloadFilter[simpleURLHashed]["PUT"].delete(item);
          }
          console.log(payloadFilterCount[simpleURLHashed]);
          console.log(payloadFilter[simpleURLHashed]);
        // payloadFilterCount[simpleURLHashed]["POST"][item]++;
        // payloadFilter[simpleURLHashed]["POST"].add(item);
      })
    }
    }
    urlsModified = true;
    removeRequestListener(true);
}
async function removePayload(newEntry){
      // if method is removed -> we need to remove from   , payload 
      console.log("new Entry ");
      console.log(newEntry);

      // simple url to add to tracker 
      let simpleURL = await newEntry.simpleUrl;
      let method = await newEntry.method;
      let payload = await newEntry.payload;
      let simpleURLHashed = await newEntry.simpleUrlHashed;
      let methodsTrackingForThisUrl = await methodsToTrack[simpleURLHashed];
      let payloadTrackingForThisUrl = await payloadFilter[simpleURLHashed];
      console.log("payload tracking for this" + simpleURL);
      console.log(payloadTrackingForThisUrl);
      // lets remove url completely 
      // urlSet[simpleURLHashed]--;
      // if(urlSet[simpleURLHashed] == 0){
      //   console.log("urlSet");
      //   console.log(urlSet)
      //   console.log("simpleUrl : " + simpleURL + " simpleUrlHashed : " + simpleURLHashed);
      //   // urlSet[simpleURLHashed] = 0;
      //   // we removed it from url Patterns
      //   urlPatterns = urlPatterns.filter(item => item !== simpleURL);
      // }
      // urlSet[simpleURLHashed]++;
      // if(!methodsToTrack[simpleURLHashed]){
      //   methodsToTrack[simpleURLHashed] = new Set();
      // }
      // if(!methodTrackingCount[simpleURLHashed]){
      //   methodTrackingCount[simpleURLHashed] = new Map();
      // }
      // methodTrackingCount[simpleURLHashed][method]--;
      // if(methodTrackingCount[simpleURLHashed][method]== 0){
      //   methodsToTrack.delete(item);
      // }
      // Object.entries(methodsTrackingForThisUrl).forEach(item =>{
      //   methodTrackingCount[simpleURLHashed][item]--;
      //   if(methodTrackingCount[simpleURLHashed][item] == 0){
      //   }
      //   // methodTrackingCount[simpleURLHashed][item]++;
      //   // methodsToTrack[simpleURLHashed].add(item);
      // })
      
      if(method == "POST"){
        console.log("removing post payload" + payload);
        // if(!(payloadFilter[simpleURLHashed])){
        //   payloadFilter[simpleURLHashed] = new Map();
        // }
        // if(!payloadFilterCount[simpleURLHashed]){
        //   payloadFilterCount[simpleURLHashed] = new Map();
        // }
        // if(!payloadFilterCount[simpleURLHashed]["POST"]){
        //   payloadFilterCount[simpleURLHashed]["POST"] = new Map();
        // }
        // if(!payloadFilter[simpleURLHashed]["POST"]){
        //   payloadFilter[simpleURLHashed]["POST"] = new Map();
        // }
        if(payloadTrackingForThisUrl && payloadTrackingForThisUrl["POST"]){
          
          Object.entries(payloadTrackingForThisUrl["POST"]).forEach(item =>{
            if(item == payload){
              console.log("we get " + item);
              if(payloadFilterCount[simpleURLHashed]["POST"][item]){
        
              }else{
                payloadFilterCount[simpleURLHashed]["POST"][item] = 0;
              }
              payloadFilterCount[simpleURLHashed]["POST"][item]--;
              if(payloadFilterCount[simpleURLHashed]["POST"][item] == 0)
                {
                  payloadFilter[simpleURLHashed]["POST"].delete(item);
                }
                console.log(payloadFilterCount[simpleURLHashed]);
                console.log(payloadFilter[simpleURLHashed]);
                
                // payloadFilterCount[simpleURLHashed]["POST"][item]++;
                // payloadFilter[simpleURLHashed]["POST"].add(item);
                
            }
          })
        }
        
      }
      if(method == "PUT"){
        // if(!(payloadFilter[simpleURLHashed])){
        //   payloadFilter[simpleURLHashed] = new Map();
        // }
        // if(!payloadFilterCount[simpleURLHashed]){
        //   payloadFilterCount[simpleURLHashed] = new Map();
        // }
        // if(!payloadFilterCount[simpleURLHashed]["POST"]){
        //   payloadFilterCount[simpleURLHashed]["POST"] = new Map();
        // }
        // if(!payloadFilter[simpleURLHashed]["POST"]){
        //   payloadFilter[simpleURLHashed]["POST"] = new Map();
        // }
        if(payloadTrackingForThisUrl && payloadTrackingForThisUrl["PUT"]){
          console.log("removing put");
        Object.entries(payloadTrackingForThisUrl["PUT"]).forEach(item =>{
          if(item == payload){
            console.log("we get" + item);
            if(payloadFilterCount[simpleURLHashed]["PUT"][item]){
      
            }else{
              payloadFilterCount[simpleURLHashed]["PUT"][item] = 0;
            }
            payloadFilterCount[simpleURLHashed]["PUT"][item]--;
            if(payloadFilterCount[simpleURLHashed]["PUT"][item] == 0)
              {
                payloadFilter[simpleURLHashed]["PUT"].delete(item);
              }
              console.log(payloadFilterCount[simpleURLHashed]);
              console.log(payloadFilter[simpleURLHashed]);
              // payloadFilterCount[simpleURLHashed]["POST"][item]++;
              // payloadFilter[simpleURLHashed]["POST"].add(item);
            }
        })
      }
    }
    urlsModified = true;
      removeRequestListener(true);
}
function addURL(newEntry){
  console.log("new Entry ");
  console.log(newEntry);
  // simple url to add to tracker 
  let simpleURL = newEntry.simpleUrl;
  let simpleURLHashed = newEntry.simpleUrlHashed;
  // adding simple urls
  if(!urlSet[simpleURLHashed]){
    console.log("urlSet");
    console.log(urlSet)
    console.log("simpleUrl : " + simpleURL + " simpleUrlHashed : " + simpleURLHashed);
    urlSet[simpleURLHashed] = 0;
    urlPatterns.push(simpleURL);
  }
  urlSet[simpleURLHashed]++;

  // adding methods 
  if(!methodsToTrack[simpleURLHashed]){
    methodsToTrack[simpleURLHashed] = new Set();
  }
  // if(!methodTrackingCount[simpleURLHashed]){
  //   methodTrackingCount[simpleURLHashed] = new Map();
  // }
  console.log("adding method ");
  newEntry.methods.forEach(item => {
    methodsToTrack[simpleURLHashed].add(item);
  })
  // Object.entries(newEntry.methods).forEach(item =>{
  //   console.log(item);
  //   if(methodTrackingCount[simpleURLHashed][item]){

  //   }else{
  //     methodTrackingCount[simpleURLHashed][item] = 0;
  //   }
  //   // methodTrackingCount[simpleURLHashed][item]++;
  //   methodsToTrack[simpleURLHashed].add(item);
  //   console.log("after adding ");
  //   // console.log(methodTrackingCount[simpleURLHashed]);
  //   console.log(methodsToTrack[simpleURLHashed]);
  // })
  // adding payload
  if(newEntry.postPayloadFilters && newEntry.postPayloadFilters.length > 0){
    console.log("postPayloadFilter");
    console.log(newEntry.postPayloadFilters);
    console.log(newEntry.postPayloadFilters);
    if(!(payloadFilter[simpleURLHashed])){
      payloadFilter[simpleURLHashed] = new Map();
    }
    // if(!payloadFilterCount[simpleURLHashed]){
    //   payloadFilterCount[simpleURLHashed] = new Map();
    // }
    // if(!payloadFilterCount[simpleURLHashed]["POST"]){
    //   payloadFilterCount[simpleURLHashed]["POST"] = new Map();
    // }
    if(!payloadFilter[simpleURLHashed]["POST"]){
      payloadFilter[simpleURLHashed]["POST"] = new Set();
    }
    console.log("payload items");
    newEntry.postPayloadFilters.forEach(item =>{
      console.log(item );
      console.log(item.field);
      if(payloadFilter[simpleURLHashed]["POST"]){

      }else{
        payloadFilter[simpleURLHashed]["POST"] = new Set();
      }
      payloadFilter[simpleURLHashed]["POST"].add(item.field);
    });
    // Object.entries(newEntry.postPayloadFilters).forEach(item =>{
    //   console.log("printing payload");
    //   console.log(item);
    //   if(payloadFilterCount[simpleURLHashed]["POST"][item]){

    //   }else{
    //     payloadFilterCount[simpleURLHashed]["POST"][item] = 0;
    //   }
    //   if(payloadFilter[simpleURLHashed]["POST"]){

    //   }else{
    //     payloadFilter[simpleURLHashed]["POST"] = new Set();
    //   }
      
    //   payloadFilterCount[simpleURLHashed]["POST"][item]++;
    //   typeof(payloadFilter[simpleURLHashed]);
    //   payloadFilter[simpleURLHashed]["POST"].add(item);
    //   console.log(payloadFilterCount[simpleURLHashed]);
    //   console.log(payloadFilter[simpleURLHashed]);
    // })
    
  }
  if(newEntry.putPayloadFilters && newEntry.putPayloadFilters.length > 0){
    console.log("putPayloadFilter");
    console.log(newEntry.putPayloadFilters);
    if(!(payloadFilter[simpleURLHashed])){
      payloadFilter[simpleURLHashed] = new Map();
    }
    let tempPut = "PUT";
    // if(!payloadFilterCount[simpleURLHashed]){
    //   payloadFilterCount[simpleURLHashed] = new Map();
    // }
    // if(!payloadFilterCount[simpleURLHashed][tempPut]){
    //   payloadFilterCount[simpleURLHashed][tempPut] = new Map();
    // }
    if(!payloadFilter[simpleURLHashed][tempPut]){
      payloadFilter[simpleURLHashed][tempPut] = [];
    }
    console.log("printing each payload");
    newEntry.putPayloadFilters.forEach(item => {
      console.log(item);
      console.log(item.field);
      if(payloadFilter[simpleURLHashed][tempPut]){
        
      }else{
        payloadFilter[simpleURLHashed][tempPut] = new Set();
      }
      payloadFilter[simpleURLHashed][tempPut].add(item.field);

    })
    // Object.entries(newEntry.putPayloadFilters).forEach(item =>{
    //   console.log(item);
    //   if(payloadFilterCount[simpleURLHashed][tempPut][item]){

    //   }else{
    //     payloadFilterCount[simpleURLHashed][tempPut][item] = 0;
    //   }
    //   if(payloadFilter[simpleURLHashed][tempPut]){
        
    //   }else{
    //     payloadFilter[simpleURLHashed][tempPut] = new Set();
    //   }
    //   console.log("type of ");
    //   console.log( typeof(payloadFilter[simpleURLHashed][tempPut]));
    //   console.log(payloadFilter);
    //   console.log(payloadFilter[simpleURLHashed]);
    //   console.log(payloadFilter[simpleURLHashed][tempPut]);
    //   payloadFilterCount[simpleURLHashed][tempPut][item]++;
    //   // if(!payloadFilter[simpleURLHashed][tempPut].has(item))
    //   payloadFilter[simpleURLHashed][tempPut].add(item);
    //   // payloadFilter[simpleURLHashed][tempPut].add(item);
    //   console.log(payloadFilterCount);
    //   console.log(payloadFilter);
    // })
    
  }
  urlsModified = true;
  removeRequestListener(true);
}
 async function getInfo(user_info){
// api call to mongo to retrieve the bookmarked urls
  
console.log("first ");
console.log(user_info);
   fetch(`http://localhost:8080/userEntry/${user_info.uid}` , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((response) => (response.json())).catch(error => {
    console.log("making a new entry ");
    apiAddUserCall({
      uid : global_user_info.sub,
      name : global_user_info.name
    });
  })
  .then(async (data) => {
    // console.log("data");
    // console.log(data);
    if(typeof(data) == undefined){
      
    }
    else{
      console.log("data");
      console.log(data);
      console.log(data.bookmarks);
      if("bookmarks" in (data)){
      // console.log("bookmarks");
      // console.log("Method to track");
      // console.log(data.methodsToTrack);
      // console.log("uiPayloadFilter");
      // console.log(data.uiPayloadFilter);
        for(let i = 0 ; i < data.bookmarks.length ; i++){
          // normal url which we will add to track
          let urlBookmark = data.bookmarks[i];
          
    
            //  console.log("for bookmark " + urlBookmark);
  
           await sha256(urlBookmark).then(async(response) =>{
            // console.log("urlBookmark hash value : " + response);
            console.log(urlBookmark);
            if(urlSet[response]){
              
            }else{
              urlSet[response] = 0;
              urlPatterns.push(urlBookmark);
              urlPatternsHashed.push(response);
            }

            // we have added all the bookmarks
            urlSet[response]++;
              // all the methods are loaded now
              if(methodsToTrack[response]){

              }else{
                methodTrackingCount[response] = new Map();
                methodsToTrack[response] = new Set();
              }
              console.log("one");
            
            Object.entries(data.methodsToTrack[response]).forEach(item =>{
              console.log("item + ");
              console.log(item[1]);
              if(methodTrackingCount[response][item[1]]){
                methodTrackingCount[response][item[1]]++;
              }else{
                methodTrackingCount[response][item[1]] = 1 ;
              }
              methodsToTrack[response].add(item[1]);
            });

              // methodsToTrack[response] = data.methodsToTrack[response];
              // Object.assign(finalTrackingMap[urlBookmark] , methodsToTrack[response]);
              // console.log("uiPayload filter for this simple ulr");
              // console.log(data.uiPayloadFilter[response]);
              // console.log("methods to Track ");
              // console.log(methodsToTrack);
              // adding methods to track
              let methodPayloadMap = new Map();
              payloadFilter[response] = new Map();
            console.log("two");
              // our count is ready 
              if(data.uiPayloadFilter[response]){

              }else{
                data.uiPayloadFilter[response] = [];
              }
              Object.entries(data.uiPayloadFilter[response]).forEach((key , list) => {
                console.log("uiPayloadEntries");
                console.log("key : " + key);
                console.log("list : " + list );
                console.log("two and half");
                  if(payloadFilterCount[response]){

                  }else{
                    payloadFilterCount[response] = new Map();
                  }
                  if(payloadFilterCount[response][key[0]]){

                  }else{
                    payloadFilterCount[response][key[0]] = new Map();
                  }
                  console.log("three");
                  // key[1].forEach(item =>{

                  // });
                  // Object.entries(key).forEach(item => {
                  //   if(payloadFilterCount[response][count][item]){
                  //     payloadFilterCount[response][count][item]++;
                  //   }else{
                  //     payloadFilterCount[response][count][item] = 1;
                  //   }
                  // })
              })
              console.log("four");
              console.log(typeof(methodPayloadMap));
              Object.assign(methodPayloadMap ,  data.uiPayloadFilter[response]);
              console.log(methodPayloadMap);
              console.log(typeof(methodPayloadMap));
              Object.entries(methodPayloadMap).forEach((key , value) =>{
                console.log(typeof(key));
                console.log(typeof(value));
                console.log(key);
                console.log(value);
                if(payloadFilter[response][key[0]]){

                }else{
                  payloadFilter[response][key[0]] = new Set();
                }
                
                (key[1]).forEach(item =>{
                  console.log("item + " + item);
                  payloadFilter[response][key[0]].add(item);
                })
                console.log(key[0] );
                console.log(key[1]);
                // payloadFilter[response][key].add(value);
                console.log(payloadFilter);
                console.log(payloadFilter[response]);
                console.log(payloadFilter[response][key[0]]);
                console.log("print ends");
              })
  
              console.log("final method payload map");
              // for each method what payload we need to track 
              console.log(methodPayloadMap);
              console.log("for has " + response + " simple " + urlBookmark);
              console.log(payloadFilter[response]);
              // now we need to update uiPayload filter basically ... so we need hash of simple url and method.. 
              // payloadFilter[response] = new Map();
              // payloadFilter[response] = methodPayloadMap;
              // console.log("finally we get payload filter as ");
              // console.log(payloadFilter);
  
          });
        }
       
      
        console.log("after adding");
        console.log(urlSet);
        console.log(urlPatterns);
        console.log("final payload filter ");
        console.log(payloadFilter);
        console.log(methodsToTrack);
        console.log("payload Filter count");
        console.log(payloadFilterCount);
        console.log("method Tracking Count");
        console.log(methodTrackingCount);
        // console.log(urlPatternsHashed);
  
      }
      else{
        console.log("bookmarks is empty ");
      }
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

// })
});
// var userURL;
};




// function getHashId(obj){
//   // Create a URL object
//   let url = obj.url;
//   // console.log("here at hash ");
//   // console.log(url);
//   const urlObj = new URL(url);
  
//   // Extract the domain (hostname)
//   const domain = urlObj.hostname;
  
//   // Extract the path
//   const path = urlObj.pathname;
  
//   // Extract query parameters
//   const queryParams = new URLSearchParams(urlObj.search);
//   let urlToHash = "";
//   urlToHash += domain;
//   if((path == null) || path.length == 0){
//     path += '/';
//   }
//   urlToHash += path;

//   const queryParamsMap = new Map();
//   queryParams.forEach((value, key) => {
//       queryParamsMap.set(key, value);
//   });
  
  
//   // Sort the keys
//   const sortedKeys = Array.from(queryParamsMap.keys()).sort();
//   sortedKeys.forEach(x =>{
//       urlToHash += x;
//   });

  
//     let hashId = sha256(urlToHash).then(value => {
//       apiGetUrlEntry({
//         id : value,
//         time : obj.time
//       });
//     });

//   }
// function apiGetUrlEntry(obj){
//       // alert("making the call");
//       // let id = getHashId(url);
//       // getHashId(url).then(value => {
//       //     console.log("inside of prmoise");
//       //     console.log(value);
//       //     id = value;
//       // });
//       let id = obj.id;
//       // console.log("id ");
//       // console.log(id);
//       // console.log("final call " + 'http://localhost:8080/urlEntry/' + id);
//       fetch('http://localhost:8080/urlEntry/' + id , {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json'
//           }
//           })
//             .then(response => response.json())
//             .then((data) => {
//               console.log(data);
//               let time = obj.time;
//               if((time - data.benchMarkTime)/(data.benchMarkTime) >= data.errorMargin){
//                 console.log("this url is not behaving correctly " + data.url );
//               }
//               // alert("The Benchmark time for " + data.url + " is -> " + data.benchMarkTime);
//             })
//             .catch(error => console.error('Error:', error));
// }
  
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

  console.log("url set");
  console.log(urlSet);
  console.log("urlPatterns");
  console.log(urlPatterns);
  console.log("methodTracking");
  console.log(methodTrackingCount);
  console.log("method to track");
  console.log(methodsToTrack);
  console.log("payload Filter count");
  console.log(payloadFilterCount);
  console.log("payload filter");
  console.log(payloadFilter);
  if(urlPatterns.length == 0){
    return;
  }
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

 async function onBeforeRequestListener(details){
  // let simpleURL = getSimpleUrl(details.url);
  // let simpleURLHash = await sha256(simpleURL);
  // console.log("simple url ");
  // console.log(simpleURL);
  // console.log("simple url Hash");
  // console.log(simpleURLHash);
  // if(methodsToTrack[simpleURLHash] &&methodsToTrack[simpleURLHash].has(details.method)){
  
  let requestBodyString = null;
    if (details.method === "POST" || details.method === "PUT") {
      const requestBody = details.requestBody;
      if (requestBody && requestBody.raw && requestBody.raw[0]) {
        // Convert array buffer to string if requestBody is available
        requestBodyString = arrayBufferToString(requestBody.raw[0].bytes);
        console.log(`Request URL: ${details.url}`);
        console.log(`Request Method: ${details.method}`);
        console.log(`Request Payload: ${requestBodyString}`);
      }
    }
    var payload = new Map();
    if(requestBodyString){
      let hash = await sha256(getSimpleUrl(details.url));
      console.log("we got the hash " + hash );
      console.log("filter");
      console.log(payloadFilter);
      console.log(payloadFilter[hash]);
      let method = details.method;
      console.log("method " + method);
      // console.log(typeof(payloadFilter[hash]));
      // console.log(payloadFilter[hash][method]);
      // console.log(typeof(payloadFilter[hash][method]));
      // console.log(payloadFilter[hash][method]);
      if(payloadFilter && payloadFilter[hash] && payloadFilter[hash][method]){
        console.log("WE ARE SEARCHING FOR PAYLOAD");
        console.log(payloadFilter);
        console.log(payloadFilter[hash]);
        console.log(payloadFilter[hash][details.method]);
        let originalObject = JSON.parse(requestBodyString);
        let obj = {};
        payloadFilter[hash][details.method].forEach(key =>{
          console.log("key : " + key);
         if (originalObject.hasOwnProperty(key)) {
          console.log(originalObject[key]);
             payload[key] = originalObject[key];
         }  
     });
  }
    }
    console.log("payload map we get");
    console.log(payload);
  requests[details.requestId] = {
    url: details.url,
    timestamp : Date.now(),
    method: details.method,
    startTime: performance.now(),
    payloadMap : payload,
  };
  // }
chrome.alarms.create({ periodInMinutes: 0.4 })
chrome.alarms.onAlarm.addListener(() => {
  console.log('log for debug')
});
}

async function onBeforeSendHeadersListener(details) {
  // let simpleURL = getSimpleUrl(details.url);
  // let simpleURLHash = await sha256(simpleURL);
  // if(methodsToTrack[simpleURLHash] && methodsToTrack[simpleURLHash].has(details.method)){
  if (requests[details.requestId]) {
    requests[details.requestId].beforeSendHeadersTime = performance.now();
  }
// }
}

async function onSendHeadersListener(details) {
  // let simpleURL = getSimpleUrl(details.url);
  // let simpleURLHash = await sha256(simpleURL);
  // if(methodsToTrack[simpleURLHash] &&methodsToTrack[simpleURLHash].has(details.method)){
  if (requests[details.requestId]) {
    requests[details.requestId].sendHeadersTime = performance.now();
  }
// }
}

async function onHeadersReceivedListener(details) {
  // let simpleURL = getSimpleUrl(details.url);
  // let simpleURLHash = await sha256(simpleURL);
  // if(methodsToTrack[simpleURLHash] &&methodsToTrack[simpleURLHash].has(details.method)){
  if (requests[details.requestId]) {
    requests[details.requestId].headersReceivedTime = performance.now();
  }
// }
}

async function onResponseStartedListener(details) {
  // let simpleURL = getSimpleUrl(details.url);
  // let simpleURLHash = await sha256(simpleURL);
  // if(methodsToTrack[simpleURLHash] &&methodsToTrack[simpleURLHash].has(details.method)){
  if (requests[details.requestId]) {
    requests[details.requestId].responseStartedTime = performance.now();
  }
// }
}

async function onCompletedListener(details) {
  // let simpleURL = getSimpleUrl(details.url);
  // let simpleURLHash = await sha256(simpleURL);
  // if(methodsToTrack[simpleURLHash] &&methodsToTrack[simpleURLHash].has(details.method)){
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
      timestamp: requests[details.requestId].timestamp,
      beforeSendHeaders: beforeSendHeadersTime - startTime,
      sendHeaders: sendHeadersTime - startTime,
      headersReceived: headersReceivedTime - startTime,
      responseStarted: responseStartedTime - startTime,
      completed: endTime - startTime,
      totalTime: endTime - startTime,
      statusCode: details.statusCode,
      ip: details.ip,
      responseTime: endTime - startTime,
      payloadMap : requests[details.requestId].payloadMap
    };
    console.log("timgngs payload");
    console.log(timings.payloadMap);
    var networkCallMetric = {
      method : timings.method,
      url : timings.url,
      responseTime : timings.responseStarted,
      totalTime : timings.totalTime,
      timestamp : timings.timestamp,
      payloadMap : timings.payloadMap,
      uid : global_user_info.sub
    }
    console.log(networkCallMetric);
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
// }
}

async function onErrorOccurredListener(details) {
  // let simpleURL = getSimpleUrl(details.url);
  // let simpleURLHash = await sha256(simpleURL);
  // if(methodsToTrack[simpleURLHash] &&methodsToTrack[simpleURLHash].has(details.method)){
  if (requests[details.requestId]) {
    console.error(`Request to ${requests[details.requestId].url} failed with error: ${details.error}`);
    delete requests[details.requestId];
  }
// }
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

function getSimpleUrl(url){
   // Create a URL object
  
   // console.log("here at hash ");
   // console.log(url);
   const urlObj = new URL(url);
   
   // Extract the domain (hostname)
   const domain = urlObj.hostname;
   
   // Extract the path
   const path = urlObj.pathname;
   
    let simpleUrl = "*://";
    simpleUrl += domain + path + '*';
    return simpleUrl;
}

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


  if(addListenerFlag === true){
    listen();
  }
};

function clear(flag){
  urlPatterns = [];
  urlSet = new Map();
  payloadFilter = new Map();
  methodsToTrack = new Map();
  urlPatternsHashed = [];
  urlPatternsWithMethodHashed = [];
  urlsModified = false;
  if(flag===true){
    is_user_signed_in = false;
    global_user_info = {};
  }

  // for (var member in global_user_info) delete global_user_info[member];
  console.log("cleared everything");
  console.log(global_user_info);
  removeRequestListener(false);
}


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) =>{
  if(request.message === "addURL") {
    // location.reload();
    // console.log("got the message ");
    console.log(request);
    //  clear(false);
    // await getInfo({
    //   uid : global_user_info.sub,
    //   name : global_user_info.name
    // });
    addURL(request.data);
    console.log("done with this");
  }else if(request.message == "removeURL"){
       clear(false);
      await getInfo({
        uid : global_user_info.sub,
        name : global_user_info.name
      });
    //   if(request.action === "url"){
    //     removeURL(request);
    //   }else if(request.action === "method"){
    //     removeMethod(request);
    //   }else if(request.action === "payload"){
    //     removePayload(request);
    //   }
    }
    sendResponse({
      message : 'success'
    })

    // console.log("send Response");
    // console.log(sendResponse);
  return true;
});

