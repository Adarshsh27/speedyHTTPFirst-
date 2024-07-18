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

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.addEventListener('click', () => fetchData(section));

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear';
    clearBtn.className = 'clear-btn';
    clearBtn.addEventListener('click', () => section.remove());

    section.appendChild(urlInput);
    section.appendChild(methodInput);
    section.appendChild(submitBtn);
    section.appendChild(clearBtn);

    document.getElementById('sections').appendChild(section);
}

function fetchData(section) {
    const urlInput = section.querySelector('.url-input').value;
    const methodInput = section.querySelector('.method-input').value;
    

    // Simulated API response
    fetch(`http://localhost:8080/networkCalls/get` + user_info.uid, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(message)
    })
    const data = {
        "responseTime": 535.1782279176304,
        "nearestEntry": {
            "id": "a471a695-3e93-4177-9fd8-cc558af4b943",
            "url": "http://localhost:8080/networkCalls",
            "uid": "111890240202136979411",
            "urlNonQuery": "b2ecb5453b9ca36b297fdbd4b603957d60453a3e229b0d9798b52d952be8cbd8",
            "urlHash": "b2ecb5453b9ca36b297fdbd4b603957d60453a3e229b0d9798b52d952be8cbd8",
            "domain": "localhost",
            "path": "/networkCalls",
            "method": "POST",
            "query": {},
            "timestamp": 1720794991216,
            "callMetrics": {
                "responseTime": 535.1000000238419,
                "totalTime": 536.1999999284744
            },
            "payloadMap": {}
        }
    };

    const responseTime = document.createElement('div');
    responseTime.textContent = `Response Time: ${data.responseTime}`;

    const nearestEntry = document.createElement('div');
    nearestEntry.innerHTML = `<br><strong>Nearest Entry:</strong> <br>
    URL: ${data.nearestEntry.url} <br>
    Method: ${data.nearestEntry.method} <br>
    Response Time: ${data.nearestEntry.callMetrics.responseTime} <br>
    Total Time: ${data.nearestEntry.callMetrics.totalTime} <br>
    Timestamp : ${data.nearestEntry.timestamp}`;

    const responseSection = document.createElement('div');
    responseSection.className = 'response-section';
    responseSection.appendChild(responseTime);
    responseSection.appendChild(nearestEntry);

    section.appendChild(responseSection);
}

document.getElementById("bookmarkList").addEventListener("click" , ()=>{
    chrome.windows.create({
        url: chrome.runtime.getURL('./removeURL.html'),
        type: 'popup',
        width: 400,
        height: 300
    });
});
