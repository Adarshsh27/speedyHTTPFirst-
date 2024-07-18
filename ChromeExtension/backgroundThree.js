// let urls = [];
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
// now final list using which we will assign trackers .. this contains simpleURL and a list of methods 


 
// payload to track for each urlMethodHashed value
var payloadFilter = new Map();
// methods to track for each urlHashed value 
var methodsToTrack = new Map();




function addURL(newEntry){
    console.log("new Entry ");
    console.log(newEntry);
    // simple url to add to tracker 
    let simpleURL = newEntry.simpleUrl;
    let simpleURLHashed = newEntry.simpleUrlHashed;
    if(!urlSet[simpleURLHashed]){
      console.log("urlSet");
      console.log(urlSet)
      console.log("simpleUrl : " + simpleURL + " simpleUrlHashed : " + simpleURLHashed);
      urlSet[simpleURLHashed] = 0;
      urlPatterns.push(simpleURL);
    }
    urlSet[simpleURLHashed]++;
    if(!methodsToTrack[simpleURLHashed]){
      methodsToTrack[simpleURLHashed] = new Set();
    }
    Object.entries(newEntry.methods).forEach(item =>{
      methodsToTrack[simpleURLHashed].add(item);
    })
    if(newEntry.postPayloadFilter && newEntry.postPayloadFilter.length > 0){
      if(!(payloadFilter[simpleURLHashed])){
        payloadFilter[simpleURLHashed] = new Map();
      }
      if(!payloadFilter[simpleURLHashed]["POST"]){
        payloadFilter[simpleURLHashed]["POST"] = new Map();
      }
      Object.entries(newEntry.postPayloadFilter).forEach(item =>{
        payloadFilter[simpleURLHashed]["POST"].add(item);
      })
      
    }
    urlsModified = true;
    removeRequestListener(true);
  }




  async function getInfo(user_info){
    // api call to mongo to retrieve the bookmarked urls
    
    // console.log("first ");
    // console.log(user_info);
     fetch(`http://localhost:8080/userEntry/${user_info.uid}` , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => (response.json())).catch(error => {
      apiAddUserCall({
        uid : global_user_info.sub,
        name : global_user_info.name
      });
    })
    .then(async (data) => {
      console.log("data");
    //   console.log(data);
      if(typeof(data) == undefined){
        
      }
      else{
        if("bookmarks" in (data)){
          console.log("bookmarks");
          console.log("Method to track");
          console.log(data.methodsToTrack);
          console.log("uiPayloadFilter");
          console.log(data.uiPayloadFilter);
          for(let i = 0 ; i < data.bookmarks.length ; i++){
            // normal url which we will add to track
            let urlBookmark = data.bookmarks[i];
             console.log("for bookmark " + urlBookmark);
             await sha256(urlBookmark).then(async(response) =>{
              console.log("urlBookmark hash value : " + response);
              urlPatternsHashed.push(response);
              if(urlSet[response]){
    
              }else{
                urlSet[response] = 0;
                urlPatterns.push(urlBookmark);
              }
              urlSet[response]++;
              // all the methods are loaded now
              methodsToTrack[response] = new Set();
              Object.entries(data.methodsToTrack[response]).forEach(item =>{
                methodsToTrack[response].add(item);
              });
              // methodsToTrack[response] = data.methodsToTrack[response];
              

              console.log("uiPayload filter for this simple ulr");
              console.log(data.uiPayloadFilter[response]);
              console.log("methods to Track ");
              console.log(methodsToTrack);
            
                // adding methods to track
                let methodPayloadMap = new Map();
                payloadFilter[response] = new Map();
                Object.assign(methodPayloadMap ,  data.uiPayloadFilter[response]);
                Object.assign(payloadFilter[response] , methodPayloadMap);
    
                console.log("final method payload map");
                // for each method what payload we need to track 
                console.log(methodPayloadMap);
                // now we need to update uiPayload filter basically ... so we need hash of simple url and method.. 
                // payloadFilter[response] = new Map();
                // payloadFilter[response] = methodPayloadMap;
                console.log("finally we get payload filter as ");
                console.log(payloadFilter);
    
            });
          }
          console.log("after adding");
          console.log(urlSet);
          console.log(urlPatterns);
          console.log("final payload filter ");
          console.log(payloadFilter);
          console.log(methodsToTrack);
          console.log(urlPatternsHashed);
        }
        else{
          console.log("bookmarks is empty ");
        }
      }
        
    
      console.log(payloadFilter);
      // console.log(urls);
      // console.log(data.bookmarks);
      if(urlPatterns.length > 0){
        console.log("we are listening");
        // listen();
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
  getInfo({
    uid : "111890240202136979411",
    name : "Adarsh Shrivastava"
  });


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