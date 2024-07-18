let selectedMethods = [];
let postFilters = [];
let putFilters = [];
let queryParamsGet = [];
let queryParamsPost = [];
let queryParamsPut = [];
let queryParamsDelete = [];
let queryParamsPatch = [];
let queryParamsOptions = [];
let queryParamsUpdate = [];
var user_info = {};
let methodList = ["Get","Post","Put","Delete","Patch","Options","Update"];

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
        
        togglePopup(method);

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


methodList.forEach(value=>{
    let addElementId = "addQueryKeyValue" + `${value}`;
    let clearElementId =  "clearQuery" + `${value}`;
    let hideElementId = "hideQueryPopup" + `${value}`;

    console.log(addElementId);
    document.getElementById(addElementId).addEventListener("click", () => {
        addQueryKeyValue(value);
    });
    document.getElementById(clearElementId).addEventListener("click", () => {
        clearQuery(value);
    });
    document.getElementById(hideElementId).addEventListener("click", () => {
        hideQueryPopup(value);
    });
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
    const postPopup = document.getElementById('postPopup');
    const putPopup = document.getElementById('putPopup');
    const queryButton = document.getElementById('addQueryButton');

    if(method == 'POST'){
        const queryPopup = document.getElementById('queryPopupPost');
    
        if (selectedMethods.includes('POST')) {
            methodList.forEach(value=>{
                if(value!='Post'){
                    let queryString = "queryPopup" + `${value}`;
                    document.getElementById(queryString).classList.add('hidden');
                }
            });
            postPopup.classList.remove('hidden');
            queryPopup.classList.remove('hidden');
            queryButton.classList.add('hidden');
        } 
        else {
            postPopup.classList.add('hidden');
            queryPopup.classList.add('hidden');
            queryButton.classList.remove('hidden');
        }
    }
    else if(method=='PUT'){
        const queryPopup = document.getElementById('queryPopupPut');
        if (selectedMethods.includes('PUT')) {
            methodList.forEach(value=>{
                if(value!='Put'){
                    let queryString = "queryPopup" + `${value}`;
                    document.getElementById(queryString).classList.add('hidden');
                }
            });
            putPopup.classList.remove('hidden');
            queryPopup.classList.remove('hidden');
            queryButton.classList.add('hidden');
        } 
        else {
            putPopup.classList.add('hidden');
            queryPopup.classList.add('hidden');
            queryButton.classList.remove('hidden');
        }
    }else if(method=='GET'){
        const queryPopup = document.getElementById('queryPopupGet');
        if(selectedMethods.includes('GET')){
            methodList.forEach(value=>{
                if(value!='Get'){
                    let queryString = "queryPopup" + `${value}`;
                    document.getElementById(queryString).classList.add('hidden');
                }
            });
            queryPopup.classList.remove('hidden');
            queryButton.classList.add('hidden');
        }else{
            queryPopup.classList.add('hidden');
            queryButton.classList.remove('hidden');
        }
    }else if(method=='DELETE'){
        const queryPopup = document.getElementById('queryPopupDelete');
        if(selectedMethods.includes('DELETE')){
            methodList.forEach(value=>{
                if(value!='Delete'){
                    let queryString = "queryPopup" + `${value}`;
                    document.getElementById(queryString).classList.add('hidden');
                }
            });
            queryPopup.classList.remove('hidden');
            queryButton.classList.add('hidden');
        }else{
            queryPopup.classList.add('hidden');
            queryButton.classList.remove('hidden');
        }
    }else if(method=='PATCH'){
        const queryPopup = document.getElementById('queryPopupPatch');
        if(selectedMethods.includes('PATCH')){
            methodList.forEach(value=>{
                if(value!='Patch'){
                    let queryString = "queryPopup" + `${value}`;
                    document.getElementById(queryString).classList.add('hidden');
                }
            });
            queryPopup.classList.remove('hidden');
            queryButton.classList.add('hidden');
        }else{
            queryPopup.classList.add('hidden');
            queryButton.classList.remove('hidden');
        }
    }else if(method=='OPTIONS'){
        const queryPopup = document.getElementById('queryPopupOptions');
        if(selectedMethods.includes('OPTIONS')){
            methodList.forEach(value=>{
                if(value!='Options'){
                    let queryString = "queryPopup" + `${value}`;
                    document.getElementById(queryString).classList.add('hidden');
                }
            });
            queryPopup.classList.remove('hidden');
            queryButton.classList.add('hidden');
        }else{
            queryPopup.classList.add('hidden');
            queryButton.classList.remove('hidden');
        }
    }else if(method=='UPDATE'){
        const queryPopup = document.getElementById('queryPopupUpdate');
        if(selectedMethods.includes('UPDATE')){
            methodList.forEach(value=>{
                if(value!='Update'){
                    let queryString = "queryPopup" + `${value}`;
                    document.getElementById(queryString).classList.add('hidden');
                }
            });
            queryPopup.classList.remove('hidden');
            queryButton.classList.add('hidden');
        }else{
            queryPopup.classList.add('hidden');
            queryButton.classList.remove('hidden');
        }
    }
    // if (method === 'POST') {
    //     document.getElementById('postPopup').classList.toggle('hidden');
    // } else if (method === 'PUT') {
    //     document.getElementById('putPopup').classList.toggle('hidden');
    // }
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
    console.log("we are in post");
    const postPopup = document.getElementById('postPopup');
    postPopup.classList.add('hidden');
    // togglePopup('POST');
});

document.getElementById('putHidePopup').addEventListener('click', () => {
    console.log("we are in put");
    const putPopup = document.getElementById('putPopup');
    putPopup.classList.add('hidden');
    // togglePopup('PUT');
});

function addPayloadFilter(method) {
    const keyInput = document.getElementById(`${method.toLowerCase()}PayloadFilterKeyInput`);
    const valueInput = document.getElementById(`${method.toLowerCase()}PayloadFilterValueInput`);
    const field = keyInput.value.trim();
    const value = valueInput.value.trim();

    if (field && value) {
        if (method === 'POST') {
            postFilters.push({ field: field, value: value });
            updateFilterList('post');
        } else if (method === 'PUT') {
            putFilters.push({ field: field, value: value });
            updateFilterList('put');
        }

        keyInput.value = '';
        valueInput.value = '';
    }
}

function updateFilterList(method) {
    const list = document.getElementById(`${method}FiltersList`);
    list.innerHTML = '';

    const filters = method === 'post' ? postFilters : putFilters;
    filters.forEach(filter => {
        const listItem = document.createElement('li');
        listItem.textContent = `${filter.field}: ${filter.value}`;
        list.appendChild(listItem);
    });
}

function clearPayloadFilters(method) {
    if (method === 'POST') {
        postFilters = [];
        updateFilterList('post');
    } else if (method === 'PUT') {
        console.log("hello");
        putFilters = [];
        updateFilterList('put');
    }
}

function addQueryKeyValue(method) {
    let queryKeyInputString = "queryKeyInput" + `${method}`;
    let queryValueInputString = "queryValueInput" + `${method}`;
    const keyInput = document.getElementById(queryKeyInputString);
    const valueInput = document.getElementById(queryValueInputString);
    const field = keyInput.value.trim();
    const value = valueInput.value.trim();


    if (field && value) {
        if(method==="Get"){
            queryParamsGet.push({ field: field, value: value });
        }else if(method==="Post"){
            queryParamsPost.push({ field: field, value: value });
        }else if(method==='Put'){
            queryParamsPut.push({ field: field, value: value });
        }else if(method==='Delete'){
            queryParamsDelete.push({ field: field, value: value });
        }else if(method==='Patch'){field
            queryParamsPatch.push({ field: field, value: value });
        }else if(method==='Options'){
            queryParamsOptions.push({ field: field, value: value });
        }else if(method==='Update'){
            queryParamsUpdate.push({ field: field, value: value });
        }

        updateQueryList(method);
        keyInput.value = '';
        valueInput.value = '';
    }
}

function updateQueryList(method) {
    let queryListString = "queryList" + `${method}`
    const list = document.getElementById(queryListString);
    list.innerHTML = '';

    if(method==='Get'){
        queryParamsGet.forEach(param => {
            const listItem = document.createElement('li');
            listItem.textContent = `${param.field}: ${param.value}`;
            list.appendChild(listItem);
        });
    }else if(method=='Post'){
        queryParamsPost.forEach(param => {
            const listItem = document.createElement('li');
            listItem.textContent = `${param.field}: ${param.value}`;
            list.appendChild(listItem);
        });
    }else if(method=='Put'){
        queryParamsPut.forEach(param => {
            const listItem = document.createElement('li');
            listItem.textContent = `${param.field}: ${param.value}`;
            list.appendChild(listItem);
        });
    }else if(method=='Delete'){
        queryParamsDelete.forEach(param => {
            const listItem = document.createElement('li');
            listItem.textContent = `${param.field}: ${param.value}`;
            list.appendChild(listItem);
        });
    }else if(method=='Patch'){
        queryParamsPatch.forEach(param => {
            const listItem = document.createElement('li');
            listItem.textContent = `${param.field}: ${param.value}`;
            list.appendChild(listItem);
        });
    }else if(method=='Options'){
        queryParamsOptions.forEach(param => {
            const listItem = document.createElement('li');
            listItem.textContent = `${param.field}: ${param.value}`;
            list.appendChild(listItem);
        });
    }else if(method=='Update'){
        queryParamsUpdate.forEach(param => {
            const listItem = document.createElement('li');
            listItem.textContent = `${param.field}: ${param.value}`;
            list.appendChild(listItem);
        });
    }
}

function clearQuery(method) {
    if(method==="Get"){
        queryParamsGet = [];
    }else if(method==="Post"){
        queryParamsPost = [];
    }else if(method==='Put'){
        queryParamsPut = [];
    }else if(method==='Delete'){
        queryParamsDelete = [];
    }else if(method==='Patch'){
        queryParamsPatch = [];
    }else if(method==='Options'){
        queryParamsOptions = [];
    }else if(method==='Update'){
        queryParamsUpdate = [];
    }

    updateQueryList(method);
}

function hideQueryPopup(method) {
    let hideElementId = "queryPopup" + `${method}`
    document.getElementById(hideElementId).classList.add('hidden');
}

document.getElementById('submitForm').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value;
    // console.log([queryParamsGet,queryParamsPost,queryParamsPut,queryParamsDelete,queryParamsPatch,queryParamsOptions,queryParamsUpdate]);
    console.log("printing payload");
    console.log(putFilters);
    console.log(postFilters);
    let queryFilters = new Map();
    if(queryParamsGet)
    Object.assign(queryFilters["GET"] , queryParamsGet);
    if(queryParamsPut)
    Object.assign(queryFilters["PUT"] , queryParamsPut);
    if(queryParamsPost)
    Object.assign(queryFilters["POST"] = queryParamsPost);
    if(queryParamsUpdate)
    Object.assign(queryFilters["UPDATE"] = queryParamsUpdate);
    if(queryParamsDelete)
    Object.assign(queryFilters["DELETE"] = queryParamsDelete);
    if(queryParamsOptions)
    Object.assign(queryFilters["OPTIONS"] = queryParamsOptions);
    // queryFilters["GET"] = queryParamsGet;
    // queryFilters["PUT"] = queryParamsPut;
    // queryFilters["POST"] = queryParamsPost;
    // queryFilters["UPDATE"] = queryParamsUpdate;
    // queryFilters["DELETE"] = queryParamsDelete;
    // queryFilters["OPTIONS"] = queryParamsOptions;
    console.log("Printing queryFilters")
    console.log(queryFilters);
    if(!isValidUrl(url)){
        alert("Please enter a VALID URL");
    }else{
        const result = {
            url: url,
            methods: selectedMethods,
            postPayloadFilters: postFilters,
            putPayloadFilters: putFilters,
            uid : user_info.uid,
            queryParams : queryFilters
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
                // console.log("closing window");
                // window.close();
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