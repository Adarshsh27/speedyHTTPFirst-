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
});

document.getElementById('putHidePopup').addEventListener('click', () => {
    console.log("we are in put");
    const putPopup = document.getElementById('putPopup');
    putPopup.classList.add('hidden');
});

function addPayloadFilter(method) {
    const keyInput = document.getElementById(`${method.toLowerCase()}PayloadKey`);
    const valueInput = document.getElementById(`${method.toLowerCase()}PayloadValue`);
    const key = keyInput.value.trim();
    const value = valueInput.value.trim();

    if (key && value) {
        const filter = { key, value };
        if (method === 'POST') {
            postFilters.push(filter);
            updateFilterList('post');
        } else if (method === 'PUT') {
            putFilters.push(filter);
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
        listItem.textContent = `${filter.key}: ${filter.value}`;
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
    const queryList = document.getElementById('queryList');
    queryList.innerHTML = '';

    queryParams.forEach(param => {
        const listItem = document.createElement('li');
        listItem.textContent = `${param.key}: ${param.value}`;
        queryList.appendChild(listItem);
    });
}

function clearQuery() {
    queryParams = [];
    updateQueryList();
}

function hideQueryPopup() {
    document.getElementById('queryPopup').classList.add('hidden');
    queryHidden = true;
}

document.getElementById('submitForm').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value;

    const data = {
        url: url,
        methods: {}
    };

    selectedMethods.forEach(method => {
        data.methods[method] = {
            payloadFilters: method === 'POST' ? postFilters : method === 'PUT' ? putFilters : []
        };
    });

    if (queryParams.length > 0) {
        data.queryParameters = queryParams;
    }

    const resultData = document.getElementById('resultData');
    resultData.textContent = JSON.stringify(data, null, 2);
    document.getElementById('result').classList.remove('hidden');

    console.log('Submitted Data:', data);
});

