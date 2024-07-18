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
document.getElementById('add-section-btn').addEventListener('click', addSection);

function addSection() {
    const section = document.createElement('div');
    section.className = 'form-section';

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Enter URL';
    urlInput.className = 'url-input';

    const methodInput = document.createElement('input');
    methodInput.type = 'text';
    methodInput.placeholder = 'Enter Method (GET/POST)';
    methodInput.className = 'method-input';

    const networkCallsCheckbox = document.createElement('input');
    networkCallsCheckbox.type = 'checkbox';
    networkCallsCheckbox.className = 'network-calls-checkbox';

    const networkCallsLabel = document.createElement('label');
    networkCallsLabel.textContent = ' Get my networkCalls';
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

    section.appendChild(urlInput);
    section.appendChild(methodInput);
    section.appendChild(checkboxSection);
    section.appendChild(submitBtn);
    section.appendChild(clearBtn);

    document.getElementById('sections').appendChild(section);
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

    // Convert timestamps to epoch
    const fromTimestampEpoch = fromTimestamp ? fromTimestamp.getTime() : 0;
    const toTimestampEpoch = toTimestamp ? toTimestamp.getTime() : Date.now();

    // Collect all data before API call
    const requestData = {
        url: urlInput,
        method: methodInput,
        flag: networkCallsChecked,
        time1: fromTimestampEpoch,
        time2: toTimestampEpoch,
        uid : user_info.uid
    };

    console.log('Request Data:', requestData);
    fetch(`http://localhost:8080/networkCalls/get`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(requestData)
    }).then(response => response.json()).catch(error => {
        console.log(error);
        alert("there was some error");
    }).then(data =>{
        displayData(section, data);
    }).catch(error => {
        console.log(error);
        alert("there are not enought calls ");
    })
    // Simulated API response
    // const data = {
    //     "responseTime": 535.1782279176304,
    //     "nearestEntry": {
    //         "id": "a471a695-3e93-4177-9fd8-cc558af4b943",
    //         "url": "http://localhost:8080/networkCalls",
    //         "uid": "111890240202136979411",
    //         "urlNonQuery": "b2ecb5453b9ca36b297fdbd4b603957d60453a3e229b0d9798b52d952be8cbd8",
    //         "urlHash": "b2ecb5453b9ca36b297fdbd4b603957d60453a3e229b0d9798b52d952be8cbd8",
    //         "domain": "localhost",
    //         "path": "/networkCalls",
    //         "method": "POST",
    //         "query": {},
    //         "timestamp": 1720794991216,
    //         "callMetrics": {
    //             "responseTime": 535.1000000238419,
    //             "totalTime": 536.1999999284744
    //         },
    //         "payloadMap": {}
    //     }
    // };

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
