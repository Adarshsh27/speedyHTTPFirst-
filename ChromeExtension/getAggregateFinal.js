
var user_info = {
    uid: '',
    name: ''
};

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
            });
        }
    });
});

document.getElementById('add-section-btn').addEventListener('click', () => {
    addSection();
});

function addSection() {
    console.log("adding");
    const section = document.createElement('div');
    section.className = 'form-section';

    const urlSelect = document.createElement('select');
    urlSelect.className = 'url-input';
    urlSelect.innerHTML = '<option value="" disabled selected>Select URL</option>';
    console.log(user_info);
    fetch('http://localhost:8080/userEntry/url/' + user_info.uid, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        data = JSON.parse(JSON.stringify(data));
        console.log(data);
        data.forEach(item => {
            item = JSON.parse(JSON.stringify(item));
            const option = document.createElement('option');
            option.value = item;
            option.text = item;
            urlSelect.appendChild(option);
        });
    })
    .catch(error => console.log(error));

    const methodSelect = document.createElement('select');
    methodSelect.className = 'method-input';
    methodSelect.innerHTML = '<option value="" disabled selected>Select Method</option>';
    methodSelect.style.display = 'none';

    urlSelect.addEventListener('change', function() {
        const selectedUrl = this.value;
        methodSelect.innerHTML = '<option value="" disabled selected>Select Method</option>';
        console.log("request");
        console.log(JSON.stringify({ id: user_info.uid, userUrl: selectedUrl }));
        fetch(`http://localhost:8080/userEntry/method`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: user_info.uid, userUrl: selectedUrl })
        })
        .then(response => {
            console.log(response);
            // console.log(response.text());
            // console.log(response.json());
            console.log(typeof(response));
            // return response.json();
            return response.text();
        })
        .then(data => {
            console.log("data");
            console.log(data);
            data = JSON.parse(JSON.stringify(data));
            console.log(data);
            data = JSON.parse(data);
            console.log(typeof(data));
            data.forEach(method => {
                method = JSON.parse(JSON.stringify(method));
                const option = document.createElement('option');
                option.value = method;
                option.text = method;
                methodSelect.appendChild(option);
            });
            methodSelect.style.display = 'inline-block';
        })
        .catch(error => console.log(error));
    });

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

    section.appendChild(urlSelect);
    section.appendChild(methodSelect);
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

    console.log('Request Data:', requestData);

    fetch(`http://localhost:8080/networkCalls/get`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayData(section, data);
    })
    .catch(error => {
        console.log(error);
        alert("There are not enough calls or there was some error.");
    });
}

function displayData(section, data) {
    const responseTime = document.createElement('div');
    responseTime.innerHTML = `<strong>Response Time: </strong> ${data.responseTime} ms <br> <br>`;

    const nearestEntry = document.createElement('div');
    nearestEntry.innerHTML = `<strong>Nearest Entry to Benchmark: </strong><br> <br>

        URL: ${data.nearestEntry.url} <br><br>
        Method: ${data.nearestEntry.method} <br><br>
        Response Time: ${data.nearestEntry.callMetrics.responseTime}<br>`;

    const responseSection = document.createElement('div');
    responseSection.className = 'response-section';
    responseSection.appendChild(responseTime);
    responseSection.appendChild(nearestEntry);

    section.appendChild(responseSection);
}
