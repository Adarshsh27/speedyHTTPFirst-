
let selectedMethods = [];
let postFilters = [];
let putFilters = [];
var user_info = {

};
document.addEventListener("DOMContentLoaded" , () =>{
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

document.querySelectorAll('#methodSelect div').forEach(item => {
    item.addEventListener('click', function() {
        const method = this.getAttribute('data-value');

        if (selectedMethods.includes(method)) {
            selectedMethods = selectedMethods.filter(m => m !== method);
            this.classList.remove('selected');
        } else {
            selectedMethods.push(method);
            this.classList.add('selected');
        }

        updateSelectedMethods();
        if(method == 'POST' || method =='PUT'){
            togglePopup(method);
        }
        
    });
});

function updateSelectedMethods() {
    const selectedMethodsContainer = document.getElementById('selectedMethods');
    selectedMethodsContainer.innerHTML = '';

    selectedMethods.forEach(method => {
        const span = document.createElement('span');
        span.classList.add('method-tag');
        span.textContent = method;
        selectedMethodsContainer.appendChild(span);
    });
}

function togglePopup(method){
    const postPopup = document.getElementById('postPopup');
    const putPopup = document.getElementById('putPopup');
    if(method == 'POST'){
        if (selectedMethods.includes('POST')) {
            postPopup.classList.remove('hidden');
        } 
        else {
            postPopup.classList.add('hidden');
        }
    }
    else{
        if (selectedMethods.includes('PUT')) {
            putPopup.classList.remove('hidden');
        } 
        else {
            putPopup.classList.add('hidden');
        }
    }
}
document.getElementById("postAddPayload").addEventListener("click" , ()=>{
    console.log("post add");
    addPayloadFilter("POST");
});
document.getElementById("putAddPayload").addEventListener("click" , ()=>{
    console.log("put add");
    addPayloadFilter("PUT");
});
document.getElementById("clearPutPayload").addEventListener("click" , ()=>{
    console.log("put clear");
    clearPayloadFilters("PUT");
});
document.getElementById("clearPostPayload").addEventListener("click" , ()=>{
    console.log("post clear");
    clearPayloadFilters("POST");
});
document.getElementById("putHidePopup").addEventListener("click" , ()=>{
    console.log("put hide");
    hidePopup("PUT");
});
document.getElementById("postHidePopup").addEventListener("click" , ()=>{
    console.log("post hide");
hidePopup("POST");
});
function addPayloadFilter(method) {
    let filterInput;
    if(method == 'POST')
    filterInput = document.getElementById('postPayloadFilterInput');
    else if(method == 'PUT'){
        filterInput = document.getElementById("putPayloadFilterInput");
    }
    console.log(filterInput);
    const filterValue = filterInput.value.trim();
    console.log(
        "input is : " + filterValue
    );
    console.log(filterValue);

    if (filterValue) {
        if (method == 'POST' && selectedMethods.includes('POST') && !postFilters.includes(filterValue)) {
            postFilters.push(filterValue);
        } else if (method == 'PUT' && selectedMethods.includes('PUT') && !putFilters.includes(filterValue)) {
            putFilters.push(filterValue);
        }
        updateFiltersList(method);
        filterInput.value = '';
    }
}

function clearPayloadFilters(method) {
    if (method=='POST'  && selectedMethods.includes('POST')) {
        postFilters = [];
    } 
    if (method == 'PUT' &&  selectedMethods.includes('PUT')) {
        putFilters = [];
    }
    updateFiltersList(method);
}

function hidePopup(method) {
    const putPopup = document.getElementById('putPopup');
    const postPopup = document.getElementById('postPopup');
    if(method == 'PUT')
    putPopup.classList.add('hidden');
    if(method == 'POST')
    postPopup.classList.add('hidden');
}

function updateFiltersList(method) {
    const postFiltersList = document.getElementById('postFiltersList');
    const putFiltersList = document.getElementById('putFiltersList');
    if(method == 'POST')
    postFiltersList.innerHTML = '';
    else if(method == 'PUT')
    putFiltersList.innerHTML = '';

    let currentFilters = [];
    if (method == ('POST')) {
        currentFilters = postFilters;
    } else if (method == ('PUT')) {
        currentFilters = putFilters;
    }

    currentFilters.forEach(filter => {
        const li = document.createElement('li');
        li.textContent = filter;
        if(method == 'POST')
        postFiltersList.appendChild(li);
        else if(method == 'PUT')
        putFiltersList.appendChild(li);
    });
}
document.getElementById('submitForm').addEventListener("click" , ()=>{
    submitForm();
})
function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
}

function submitForm() {
    const url = document.getElementById('urlInput').value;
    if(!isValidUrl(url)){
        alert("Please Enter a valid URL");
    }else{
        const result = {
            url: url,
            uid : user_info.uid,
            methods: selectedMethods,
            postPayloadFilters: postFilters,
            putPayloadFilters: putFilters
        };
        updateUserEntryApiCall(result);
        parse(result);
        console.log("result is");
        
            // parse(result);
           // <!-- document.getElementById('resultData').textContent = JSON.stringify(result, null, 2); -->
            console.log("submitting only"); 
        //    console.log(JSON.stringify(result, null, 2));
            console.log(result);
            
    }
    
   
   // <!-- document.getElementById('result').classList.remove('hidden'); -->
}
function updateUserEntryApiCall(result){
        fetch('http://localhost:8080/userEntry/' + result.uid ,  {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
              },
            body : JSON.stringify(result)
        })
        .then(reponse => reponse.json())
        .then(data =>{
            console.log("user is update successfully")
            console.log(data);
        } 
    )
        .catch(error => console.log("unsual error occured please try again later "));
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

async function parse(result){
    url = result.url;
    methods = result.methods;
    let newUrl = "*://";
   
    const urlObj = new URL(url);

// Extract the domain (hostname)
    const domain = urlObj.hostname;

// Extract the path
    const path = urlObj.pathname;
    console.log( " path ");
    newUrl += domain + path + "*";
    console.log("simpleUrl : " + newUrl);
    simpleUrlHashed = await sha256(newUrl);
    chrome.runtime.sendMessage({
        message : "addURL" , data: {
            simpleUrl : newUrl,
            simpleUrlHashed : simpleUrlHashed,
            postPayloadFilters : result.postPayloadFilters,
            putPayloadFilters : result.putPayloadFilters,
            methods : selectedMethods
        }} ,  (response) => {
            if(response.message === 'success'){
                console.log("closing window");
                window.close();
            }
        });    
//     chrome.runtime.sendMessage({ action: "sendData", data: {
//         simpleUrl : newUrl,
//         simpleUrlHashed : simpleUrlHashed,
//         postPayloadFilters : result.postFilters,
//         putPayloadFilters : result.putFilters,
//         methods : selectedMethods
//     }
// }, (response) => {
//         console.log("we are here in third");
//         console.log(response);
//     });
//     window.close();
}
