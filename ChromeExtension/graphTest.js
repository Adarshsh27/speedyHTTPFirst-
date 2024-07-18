let ctx , chart;
function update(data) {
    // Parse data
    console.log(data);

    // Sort data by timestamp
    data.sort((a, b) => a.timestamp - b.timestamp);

    const timestamps = data.map(d => {
        let timestamp = d.timestamp;
        if (timestamp > 1e12) {  // If timestamp is too large, convert from milliseconds to seconds
            timestamp = timestamp / 1000;
        }
        return new Date(timestamp * 1000);
    });

    const responseTimes = data.map(d => d.responseTime);
    const ids = data.map(d => d.id);
    const benchmarkTime = data[0].benchmarkTime;
    const maxResponseTime = Math.max(...responseTimes);
    const minResponseTime = Math.min(...responseTimes);
    console.log(timestamps);
    console.log(responseTimes);
    console.log(ids);
    console.log(benchmarkTime);
    console.log(maxResponseTime);
    console.log(minResponseTime);
    console.log("we are here");

    ctx = document.getElementById('responseTimeChart').getContext('2d');
    if(chart){
        chart.destroy();
    }
     chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                label: 'Response Time',
                data: responseTimes,
                borderColor: 'blue',
                borderWidth: 1,
                pointRadius: 5,
                pointHoverRadius: 8,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour'
                    },
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Response Time (ms)'
                    }
                }
            },
            plugins: {
                annotation: {
                    annotations: [
                        {
                            type: 'line',
                            scaleID: 'y',
                            value: maxResponseTime,
                            borderColor: 'red',
                            borderWidth: 2,
                            label: {
                                content: 'Max Response Time',
                                enabled: true,
                                position: 'end',
                                backgroundColor: 'red'
                            }
                        },
                        {
                            type: 'line',
                            scaleID: 'y',
                            value: minResponseTime,
                            borderColor: 'green',
                            borderWidth: 2,
                            label: {
                                content: 'Min Response Time',
                                enabled: true,
                                position: 'end',
                                backgroundColor: 'green'
                            }
                        },
                        {
                            type: 'line',
                            scaleID: 'y',
                            value: benchmarkTime,
                            borderColor: 'orange',
                            borderWidth: 2,
                            label: {
                                content: 'Benchmark Time',
                                enabled: true,
                                position: 'end',
                                backgroundColor: 'orange'
                            }
                        }
                    ]
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                        threshold: 10
                    }
                }
            },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const id = ids[index];
                    // Simulate an API call to get JSON data
                    fetch('http://localhost:8080/networkCalls/' + id, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                        // body : JSON.stringify(networkCallEntry)
                    })
                        .then(reponse => reponse.json())
                        .then(data => {
                            console.log("data");
                            console.log(data);
                            const jsonData = JSON.stringify(data, null, 2);
                            addJsonDetails(jsonData);

                            // update(data.data , data.benchmarkTime);
                        })
                        .catch(error => console.log(error));

                }
            }
        }
    });

    function addJsonDetails(jsonData) {
        const jsonBox = document.createElement('div');
        jsonBox.classList.add('json-box');

        const pre = document.createElement('pre');
        pre.textContent = jsonData;

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear';
        clearButton.addEventListener('click', () => {
            jsonBox.remove();
        });

        jsonBox.appendChild(pre);
        jsonBox.appendChild(clearButton);
        document.getElementById('dataDetails').appendChild(jsonBox);
    }
    document.getElementById('resetZoomButton').addEventListener('click', () => {
        chart.resetZoom();
    });
}

document.getElementById('clearAllButton').addEventListener('click', () => {
    document.getElementById('dataDetails').innerHTML = '';
});
document.getElementById('compareButton').addEventListener('click', () => {
    chrome.windows.create({
        url: chrome.runtime.getURL('./graphTestFive.html'),
        type: 'popup',
        width: 400,
        height: 300
    }, (response) => {
        window.close();
    });
});

document.getElementById('bookmarkList').addEventListener('click', () => {
    chrome.windows.create({
        url: chrome.runtime.getURL('./removeURL.html'),
        type: 'popup',
        width: 400,
        height: 300
    });
});

var user_info = {
    uid: '',
    name: ''

}

document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({
        message: 'load'
    }, async (response) => {
        //  alert(response.uid);
        //  alert(response.name);
        user_info.uid = response.uid;
        user_info.name = response.name;
        console.log(user_info);
    });
});
document.getElementById('submitUrl').addEventListener("click", () => {
    let url = document.getElementById("urlInput").value;
    let method = document.getElementById("methodInput").value;
    console.log(url + method);
    //  url;
    // uid;
    //  flag;
    //  method;
    let message = {
        url: url,
        method: method,
        flag: false,
        uid: user_info.uid
    }
    fetch('http://localhost:8080/networkCalls/plot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
        // body : JSON.stringify(networkCallEntry)
    })
        .then(reponse => reponse.json())
        .then(data => {
            console.log("data");
            console.log(data);
            if (data === null) {
                alert(" There are not enough calls ");
                data = [{
                    benchmarkTime: 0, timestamp: 0, id: 0, responseTime: 0
                }];
            }
            update(data);
            // update(data.data , data.benchmarkTime);
        })
        .catch(error => console.log(error));

});
