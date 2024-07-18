var user_info = {
    uid: '',
    name: ''
}

document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({
        message: 'load'
    }, async (response) => {
        user_info.uid = response.uid;
        user_info.name = response.name;
        if (response.uid == undefined) {
            chrome.runtime.sendMessage({
                message: "timed_out"
            }, (response) => {
                window.close();
            })
        }
    });
    fetchUrlOptions();
});

document.getElementById('add-section-btn').addEventListener('click', response => {
    addSection();
});

function fetchUrlOptions() {
    // Replace this with actual API call to fetch URL options
    // Example API call:
    // fetch('https://api.example.com/urls')
    //     .then(response => response.json())
    //     .then(data => {
    //         populateUrlOptions(data.urls);
    //     })
    //     .catch(error => console.error('Error fetching URLs:', error));

    const exampleUrls = ['https://api.example.com/data1', 'https://api.example.com/data2', 'https://api.example.com/data3'];
    populateUrlOptions(exampleUrls);
}

function populateUrlOptions(urls) {
    const urlSelect = document.createElement('select');
    urlSelect.className = 'url-input';
    urlSelect.addEventListener('change', (event) => fetchMethodOptions(event.target, urlSelect));

    urls.forEach(url => {
        const option = document.createElement('option');
        option.value = url;
        option.textContent = url;
        urlSelect.appendChild(option);
    });

    const section = document.createElement('div');
    section.className = 'form-section';
    section.appendChild(urlSelect);
    document.getElementById('sections').appendChild(section);
}

function fetchMethodOptions(select, section) {
    if (section.querySelector('.method-input')) {
        section.querySelector('.method-input').remove();
    }

    // Replace this with actual API call to fetch method options based on selected URL
    // Example API call:
    // fetch(`https://api.example.com/methods?url=${encodeURIComponent(select.value)}`)
    //     .then(response => response.json())
    //     .then(data => {
    //         populateMethodOptions(data.methods, section);
    //     })
    //     .catch(error => console.error('Error fetching methods:', error));

    const exampleMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    populateMethodOptions(exampleMethods, section);
}

function populateMethodOptions(methods, section) {
    const methodSelect = document.createElement('select');
    methodSelect.className = 'method-input';
    
    methods.forEach(method => {
        const option = document.createElement('option');
        option.value = method;
        option.textContent = method;
        methodSelect.appendChild(option);
    });

    section.appendChild(methodSelect);

    addCheckboxesAndButtons(section);
}

function addCheckboxesAndButtons(section) {
    const networkCallsCheckbox = document.createElement('input');
    networkCallsCheckbox.type = 'checkbox';
    networkCallsCheckbox.className = 'network-calls-checkbox';

    const networkCallsLabel = document.createElement('label');
    networkCallsLabel.textContent = ' Get my network calls';
    networkCallsLabel.className = 'checkbox-label';

    const timestampCheckbox = document.createElement('input');
    timestampCheckbox.type = 'checkbox';
    timestampCheckbox.className = 'timestamp-checkbox';
    timestampCheckbox.addEventListener('change', () => toggleTimestampInputs(timestampCheckbox, section));

    const timestampLabel = document.createElement('label');
    timestampLabel.textContent = ' Add timestamps';
    timestampLabel.className = 'checkbox-label';

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.addEventListener('click', () => fetchData(section));

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear';
    clearBtn.className = 'clear-btn';
    clearBtn.addEventListener('click', () => section.remove());

    const checkboxSection = document.createElement('div');
    checkboxSection.className = 'checkbox-section';
    checkboxSection.appendChild(networkCallsCheckbox);
    checkboxSection.appendChild(networkCallsLabel);
    checkboxSection.appendChild(document.createElement('br'));
    checkboxSection.appendChild(timestampCheckbox);
    checkboxSection.appendChild(timestampLabel);

    section.appendChild(checkboxSection);
    section.appendChild(submitBtn);
    section.appendChild(clearBtn);
}

function toggleTimestampInputs(checkbox, section) {
    if (checkbox.checked) {
        const timestampSection = document.createElement('div');
        timestampSection.className = 'timestamp-section';
        timestampSection.id = 'timestamp-section';

        const fromInput = document.createElement('input');
        fromInput.type = 'text';
        fromInput.placeholder = 'From';
        fromInput.className = 'timestamp-input';
        fromInput.id = 'from-input';

        const toInput = document.createElement('input');
        toInput.type = 'text';
        toInput.placeholder = 'To';
        toInput.className = 'timestamp-input';
        toInput.id = 'to-input';

        timestampSection.appendChild(fromInput);
        timestampSection.appendChild(toInput);

        section.insertBefore(timestampSection, section.querySelector('button'));

        flatpickr(fromInput, { enableTime: true, dateFormat: "Y-m-d H:i" });
        flatpickr(toInput, { enableTime: true, dateFormat: "Y-m-d H:i" });
    } else {
        const timestampSection = section.querySelector('#timestamp-section');
        if (timestampSection) {
            timestampSection.remove();
        }
    }
}

function fetchData(section) {
    const urlInput = section.querySelector('.url-input').value;
    const methodInput = section.querySelector('.method-input').value;
    const networkCallsChecked = section.querySelector('.network-calls-checkbox').checked;
    const timestampCheckboxChecked = section.querySelector('.timestamp-checkbox').checked;
    const fromTimestamp = timestampCheckboxChecked ? section.querySelector('#from-input')._flatpickr.selectedDates[0] : null;
    const toTimestamp = timestampCheckboxChecked ? section.querySelector('#to-input')._flatpickr.selectedDates[0] : null;

    const fromTimestampEpoch = fromTimestamp ? fromTimestamp.getTime() : 0;
    const toTimestampEpoch = toTimestamp ? toTimestamp.getTime() : Date.now();

    const requestData = {
        url: urlInput,
        method: methodInput,
        flag: networkCallsChecked,
        time1: fromTimestampEpoch,
        time2: toTimestampEpoch,
        uid: user_info.uid
    };
    displayData(section, {
        responseTime: 1000,
        nearestEntry: {
            id: "sdfafd",
            url: "adfafa",
            method: "PUT",
            callMetrics: {
                responseTime: 192
            }
        }

    });
    console.log('Request Data:', requestData);

    fetch(`http://localhost:8080/networkCalls/get`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    }).then(response => response.json()).catch(error => {
        console.log(error);
        alert("There was some error");
    }).then(data => {
        displayData(section, data);
    }).catch(error => {
        console.log(error);
        alert("There are not enough calls");
    });

}

function displayData(section, data) {
    const responseTime = document.createElement('div');
    responseTime.innerHTML = `Response Time: ${data.responseTime}`;

    const nearestEntry = document.createElement('div');
    nearestEntry.innerHTML = `Nearest Entry: <br>
        ID: ${data.nearestEntry.id} <br>
        URL: ${data.nearestEntry.url} <br>
        Method: ${data.nearestEntry.method} <br>
        Response Time: ${data.nearestEntry.callMetrics.responseTime}`;

    const responseSection = document.createElement('div');
    responseSection.className = 'response-section';
    responseSection.appendChild(responseTime);
    responseSection.appendChild(nearestEntry);

    section.appendChild(responseSection);
}
