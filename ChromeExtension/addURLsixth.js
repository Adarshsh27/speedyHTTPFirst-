let selectedMethods = [];
let postFilters = [];
let putFilters = [];
let queryParams = [];
var user_info = {};

document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({
        message: 'load'
    }, async (response) => {
        user_info.uid = response.uid;
        user_info.name = response.name;
        console.log(user_info);
        if (response.uid == undefined) {
            chrome.runtime.sendMessage({
                message: "timed_out"
            }, (response) => {
                window.close();
            })
        }
    });
});

document.querySelectorAll('#methodSelect div').forEach(item => {
    item.addEventListener('click', function () {
        const method = this.getAttribute('data-value');

        if (selectedMethods.includes(method)) {
            selectedMethods = selectedMethods.filter(m => m !== method);
            this.classList.remove('selected');
        } else {
            selectedMethods.push(method);
            this.classList.add('selected');
        }

        updateSelectedMethods();
        if (method == 'POST' || method == 'PUT') {
            togglePopup(method);
        }
    });
});
let queryHidden = true;
document.getElementById("addQueryButton").addEventListener("click", () => {
    if(queryHidden){
        document.getElementById('queryPopup').classList.remove('hidden');
        queryHidden = false;
    }else{
        document.getElementById('queryPopup').classList.add('hidden');
        queryHidden = true;
    }
});

document.getElementById("addQueryKeyValue").addEventListener("click", () => {
    addQueryKeyValue();
});

document.getElementById("clearQuery").addEventListener("click", () => {
    clearQuery();
});

document.getElementById("hideQueryPopup").addEventListener("click", () => {
    hideQueryPopup();
});

function updateSelectedMethods() {
    const selectedMethodsContainer = document.getElementById('selectedMethods');
    selectedMethodsContainer.innerHTML = '';

    selectedMethods.forEach(method => {
        const methodTag = document.createElement('div');
        methodTag.className = 'method-tag';
        methodTag.innerText = method;
        selectedMethodsContainer.appendChild(methodTag);
    });
}

function togglePopup(method) {
    if (method === 'POST') {
        document.getElementById('postPopup').classList.toggle('hidden');
    } else if (method === 'PUT') {
        document.getElementById('putPopup').classList.toggle('hidden');
    }
}

document.getElementById('postAddPayload').addEventListener('click', () => {
    addPayloadFilter('POST');
});

document.getElementById('putAddPayload').addEventListener('click', () => {
    addPayloadFilter('PUT');
});

document.getElementById('clearPostPayload').addEventListener('click', () => {
    clearPayloadFilters('POST');
});

document.getElementById('clearPutPayload').addEventListener('click', () => {
    clearPayloadFilters('PUT');
});

document.getElementById('postHidePopup').addEventListener('click', () => {
    togglePopup('POST');
});

document.getElementById('putHidePopup').addEventListener('click', () => {
    togglePopup('PUT');
});

function addPayloadFilter(method) {
    const input = document.getElementById(`${method.toLowerCase()}PayloadFilterInput`);
    const filterValue = input.value.trim();

    if (filterValue) {
        if (method === 'POST') {
            postFilters.push(filterValue);
            updateFilterList('post');
        } else if (method === 'PUT') {
            putFilters.push(filterValue);
            updateFilterList('put');
        }

        input.value = '';
    }
}

function updateFilterList(method) {
    const list = document.getElementById(`${method}FiltersList`);
    list.innerHTML = '';

    const filters = method === 'post' ? postFilters : putFilters;
    filters.forEach(filter => {
        const listItem = document.createElement('li');
        listItem.textContent = filter;
        list.appendChild(listItem);
    });
}

function clearPayloadFilters(method) {
    if (method === 'POST') {
        postFilters = [];
        updateFilterList('post');
    } else if (method === 'PUT') {
        putFilters = [];
        updateFilterList('put');
    }
}

function addQueryKeyValue() {
    const keyInput = document.getElementById('queryKeyInput');
    const valueInput = document.getElementById('queryValueInput');
    const key = keyInput.value.trim();
    const value = valueInput.value.trim();

    if (key && value) {
        queryParams.push({ key: key, value: value });
        updateQueryList();
        keyInput.value = '';
        valueInput.value = '';
    }
}

function updateQueryList() {
    const list = document.getElementById('queryList');
    list.innerHTML = '';

    queryParams.forEach(param => {
        const listItem = document.createElement('li');
        listItem.textContent = `${param.key}: ${param.value}`;
        list.appendChild(listItem);
    });
}

function clearQuery() {
    queryParams = [];
    updateQueryList();
}

function hideQueryPopup() {
    document.getElementById('queryPopup').classList.add('hidden');
}

document.getElementById('submitForm').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value;
    if(!isValidUrl(url)){
        alert("Please enter a VALID URL");
    }else{
        const result = {
            url: url,
            methods: selectedMethods,
            postPayloadFilters: postFilters,
            putPayloadFilters: putFilters,
            queryParams: queryParams,
            uid : user_info.uid
        };
            console.log(result);
            submitForm(result);
    }
    // document.getElementById('resultData').textContent = JSON.stringify(result, null, 2);
    // document.getElementById('result').classList.remove('hidden');
});
function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
}


function submitForm(result) {
    updateUserEntryApiCall(result);
    parse(result);
    console.log("result is");
    
        // parse(result);
       // <!-- document.getElementById('resultData').textContent = JSON.stringify(result, null, 2); -->
        console.log("submitting only"); 
    //    console.log(JSON.stringify(result, null, 2));
        console.log(result);
    // const url = document.getElementById('urlInput').value;
    // if(!isValidUrl(url)){
    //     alert("Please Enter a valid URL");
    // }else{
    //     const result = {
    //         url: url,
    //         uid : user_info.uid,
    //         methods: selectedMethods,
    //         postPayloadFilters: postFilters,
    //         putPayloadFilters: putFilters
    //     };    
    // }
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