var user_info = {
    uid : '',
    name : ''

}

document.addEventListener('DOMContentLoaded', function() {
     chrome.runtime.sendMessage({
        message : 'load'
    }, async (response) =>{
        //  alert(response.uid);
        //  alert(response.name);
         user_info.uid = response.uid;
         user_info.name = response.name;
         console.log(user_info);
         if(response.uid == undefined){
          chrome.runtime.sendMessage({
              message : "timed_out"
          } , (response) =>{
              window.close();
          })
      }
    });
});
// document.getElementById("urlSubmit").addEventListener("click" , ()=>{
    
//     let url = document.getElementById('enterURL').value;
//     // var hash;
//     // hashUrlToInteger(url).then(response => {
//     //     hash = response;
//     // });
//     alert(url);
//     // console.log(url + " " + hash);
//     apiAddURLCall({
//         uid : user_info.uid,
//         newURL : url
//     });
//     console.log("sending url : " + url);
//     chrome.runtime.sendMessage({
//         message : "add",
//         newURL : url,
//     });
// });
document.getElementById("urlSubmit").addEventListener("click" , ()=>{
        chrome.windows.create({
            // url: chrome.runtime.getURL('./addurlthird.html'),
            url: chrome.runtime.getURL('./addFourthurl1.html'),
            type: 'popup',
            width: 1000,
            height: 900
        });
        
});
// chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
//         if (request.action === "sendData") {
//             console.log( `Received data:`);
//             console.log(request.data);
//             console.log(JSON.stringify(request.data));
//         }
//         sendResponse({
//             response : "hi from welcome"
//         });
//         return true;
// });
document.getElementById("urlRemoveSubmit").addEventListener("click" , ()=>{
    chrome.windows.create({
        url: chrome.runtime.getURL('./removeURL.html'),
        type: 'popup',
        width: 1000,
        height: 900
    });
});

// ========> will fix this
// document.getElementById("urlTrackSubmit").addEventListener("click" , ()=>{
//     let url = document.getElementById('enterURLTrack').value;
//     let method = document.getElementById('enterMethodTrack').value;
//     alert(url);
//     getComplexHashId(url,method).then(urlHash => {
//         apiGetUrlEntry(urlHash);
//     });
// });
async function getComplexHashId(url , method){
    // Create a URL object
console.log("here at hash ");
console.log(url);
const urlObj = new URL(url);

// Extract the domain (hostname)
const domain = urlObj.hostname;

// Extract the path
const path = urlObj.pathname;

// Extract query parameters
const queryParams = new URLSearchParams(urlObj.search);
let urlToHash = "*://";
urlToHash += domain;
urlToHash += path + "*/";


const queryParamsMap = new Map();
queryParams.forEach((value, key) => {
    queryParamsMap.set(key, value);
});


// Sort the keys
const sortedKeys = Array.from(queryParamsMap.keys()).sort();
sortedKeys.forEach(x =>{
    urlToHash += x + "/";
});

urlToHash+= method;
  let hashId = await sha256(urlToHash)
  console.log("finally " + hashId);
  return hashId;

}
async function getHashId(url){
// Create a URL object
console.log("here at hash ");
console.log(url);
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

  let hashId = await sha256(urlToHash)
  console.log("finally " + hashId);
  return hashId;
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
function apiGetUrlEntry(id){
    // alert("making the call");
    // let id = getHashId(url);
    // getHashId(url).then(value => {
    //     console.log("inside of prmoise");
    //     console.log(value);
    //     id = value;
    // });
    console.log("id ");
    console.log(id);
    console.log("final call " + 'http://localhost:8080/urlEntry/' + id);
    fetch('http://localhost:8080/urlEntry/' + id , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
        })
          .then(response => response.json())
          .then((data) => {
            console.log(data);
            alert("The Benchmark time for " + data.url + " is -> " + data.benchMarkTime);
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

function apiGetAllUserCall(){
    // alert("making the call");
    fetch('http://localhost:8080/userEntry' , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
    })
      .then(response => response.json())
      .then(data => alert(data))
      .catch(error => console.error('Error:', error));
}
function apiGetUserCall(userID){
    console.log(userID);
    console.log("http://localhost:8080/userEntry/" + userID);
    fetch("http://localhost:8080/userEntry/"+userID , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => (response.json()))
    .then(data => console.log(data))
    .catch(error => console.log("error has occured" ));
}
function apiAddUserCall(message){
    console.log(message);
    console.log(JSON.stringify(message));
    fetch( 'http://localhost:8080/userEntry' ,  {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body : JSON.stringify(message)
    })
    .then(reponse => reponse.json())
    .then(data => console.log("new user added" + data))
    .catch(error => console.error('Error:', error));
}
function apiAddURLCall(message){
    console.log("user iD " + message.uid);
    fetch(`http://localhost:8080/userEntry/` + message.uid , {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
          },
        body :  message.newURL})
    .then(reponse => reponse.json())
    .then(data => console.log(data))
    .catch(error => console.log("an error has occured while adding url "));
}
function apiRemoveURLCall(message){
    console.log(message);
    fetch("http://localhost:8080/userEntry/" + message.uid , {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
          },
        body : message.newURL
    })
    .then(reponse => reponse.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}
function apiGetAggregateCall(message){
        fetch('http://localhost:8080/networkCalls/get' , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify(message)
        })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error('Error:', error));
}

document.getElementById("sign-out").addEventListener("click", function() {
    chrome.runtime.sendMessage({
       message : "logout"
   }, async (response) =>{
    if(response.message === 'success'){
        console.log("closing window");
        window.close();
    }
   });
});

// =========> will fix this

document.getElementById("goToAggregate").addEventListener("click" , ()=>{
    
    // let url = document.getElementById('enterURLAggregate').value;
    // let method = document.getElementById('enterMethodAggregate').value;
    // let time1 = document.getElementById('enterTime1').value;
    // let time2 = document.getElementById('enterTime2').value;
    // console.log("here in aggregation " + url +" " +  time1 + " "  + time2)
    // getComplexHashId(url , method).then(urlHash =>{
    //     apiGetAggregateCall({
    //         urlHash : urlHash,
    //         time1 : time1,
    //         time2 : time2
    //     })
    // })
    chrome.windows.create({
      url : chrome.runtime.getURL('./getAggregateFinal.html'),
      type : 'popup',
      width: 1000,
      height: 900
    })
});
document.getElementById("plotButton").addEventListener("click" , ()=>{
  console.log("plot ");
  chrome.windows.create({
    url: chrome.runtime.getURL('./graph3432.html'),
    type: 'popup',
    width: 1000,
    height: 900
});
});


document.getElementById('uploadHar').addEventListener('click', async () => {
    const harFile = document.getElementById('harFile').files[0];
    if (!harFile) {
      alert('Please select a HAR file.');
      return;
    }
  
    const formData = new FormData();
    formData.append('harFile', harFile);
    formData.append('uid' , user_info.uid);
    console.log(formData);
    try {
      const response = await fetch('http://localhost:8080/har', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        alert('HAR file uploaded successfully!');
      } else {
        alert('Failed to upload HAR file.');
      }
    } catch (error) {
      console.error('Error uploading HAR file:', error);
      alert('Error uploading HAR file.');
    }
  });
  


  document.addEventListener('DOMContentLoaded', function() {
    // Function to check if both arrays are empty
  chrome.storage.local.get(['validationFailed', 'benchmarkFailed'], function(result) {
      let validationArray = result.validationFailed || [];
      let benchmarkArray = result.benchmarkFailed || [];

      if (validationArray.length === 0 && benchmarkArray.length === 0) {
          console.log('Both arrays (validationFailed and benchmarkFailed) are empty.');

      } else {
          console.log('Arrays are not empty.');
          console.log('validationFailed:', validationArray);
          console.log('benchmarkFailed:', benchmarkArray);
          showAlert();
      }
  });
});
document.getElementById("alertIcon").addEventListener("click" , () =>{
  console.log("he clicked")
  chrome.windows.create({
    url: chrome.runtime.getURL('./alertPoptwo.html'),
    type: 'popup',
    width: 1000,
    height: 900
});
});
console.log(document.getElementById("alertIcon"));

function showAlert() {
    const alertElement = document.getElementById('alert');
    alertElement.classList.add('visible');
}

chrome.runtime.onMessage.addListener((request , sender , sendResponse) =>
{
  if(request.message== ("benchmarkFailed") || request.message == ("validationFailed")){
    let user_choice = confirm("Anomalous behaviour detect from one of your calls. Do you want to be redirected?");
    if(user_choice){
      chrome.windows.create({
        url: chrome.runtime.getURL('./alertPoptwo.html'),
        type: 'popup',
        width: 1000,
        height: 900
    });
    }
    else{
      alert("Make sure to look at what went wrong!");
    }
    
    showAlert();
    sendResponse({
      message : "success"
    })
    return true;
  }
  
});

document.getElementById("putButton").addEventListener("click" , () =>{
 
      fetch('http://localhost:8080/testing' ,  {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
            },
          body : ""
      })
      .then(reponse => reponse.json())
      .then(data => {
        console.log("new user added");
        console.log(data);
      })
      .catch(error => console.log("unsual error occured please try again later "));
});