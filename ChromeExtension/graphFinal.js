// const { downloadBrowser } = require("puppeteer/internal/node/install.js");
let chart;
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
    document.getElementById("legendBox").classList.remove('hidden');
    const ctx = document.getElementById('responseTimeChart').getContext('2d');
    // const chart = new Chart(ctx, 
    //     {
    //     type: 'line',
    //     data: {
    //         labels: timestamps,
    //         datasets: [{
    //             label: 'Response Time',
    //             data: responseTimes,
    //             borderColor: 'blue',
    //             borderWidth: 1,
    //             pointRadius: 5,
    //             pointHoverRadius: 8,
    //             fill: false
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             x: {
    //                 type: 'time',
    //                 time: {
    //                     unit: 'day'
    //                 },
    //                 title: {
    //                     display: true,
    //                     text: 'Timestamp'
    //                 }
    //             },
    //             y: {
    //                 beginAtZero: true,
    //                 title: {
    //                     display: true,
    //                     text: 'Response Time (ms)'
    //                 }
    //             }
    //         },
    //         plugins: {
    //             annotation: {
    //                 annotations: [
    //                     {
    //                         type: 'line',
    //                         scaleID: 'y',
    //                         value: maxResponseTime,
    //                         borderColor: 'red',
    //                         borderWidth: 2,
    //                         label: {
    //                             content: 'Max Response Time',
    //                             enabled: true,
    //                             position: 'end',
    //                             backgroundColor: 'red'
    //                         }
    //                     },
    //                     {
    //                         type: 'line',
    //                         scaleID: 'y',
    //                         value: minResponseTime,
    //                         borderColor: 'green',
    //                         borderWidth: 2,
    //                         label: {
    //                             content: 'Min Response Time',
    //                             enabled: true,
    //                             position: 'end',
    //                             backgroundColor: 'green'
    //                         }
    //                     },
    //                     {
    //                         type: 'line',
    //                         scaleID: 'y',
    //                         value: benchmarkTime,
    //                         borderColor: 'orange',
    //                         borderWidth: 2,
    //                         label: {
    //                             content: 'Benchmark Time',
    //                             enabled: true,
    //                             position: 'end',
    //                             backgroundColor: 'orange'
    //                         }
    //                     }
    //                 ]
    //             },
    //             zoom: {
    //                 zoom: {
    //                     wheel: {
    //                         enabled: true,
    //                     },
    //                     pinch: {
    //                         enabled: true
    //                     },
    //                     mode: 'xy',
    //                 },
    //                 pan: {
    //                     enabled: true,
    //                     mode: 'xy',
    //                     threshold: 10
    //                 }
    //             }
    //         },
    //         onClick: (e, elements) => {
    //             if (elements.length > 0) {
    //                 const index = elements[0].index;
    //                 const id = ids[index];
    //                 // Simulate an API call to get JSON data
    //                 fetch('http://localhost:8080/networkCalls/' + id, {
    //                     method: 'GET',
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     }
    //                     // body : JSON.stringify(networkCallEntry)
    //                 })
    //                     .then(reponse => reponse.json())
    //                     .then(data => {
    //                         console.log("data");
    //                         console.log(data);
    //                         const jsonData = JSON.stringify(data, null, 2);
    //                         addJsonDetails(jsonData , data.benchmarkTime);
    //                     })
    //                     .catch(error => console.log(error));

    //             }
    //         }
    //     }
    // });
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
                        unit: 'week'
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
                                backgroundColor: 'red',
                                color: 'white',
                                font: {
                                    size: 12
                                },
                                xAdjust: 50,  // Adjust this value to position the label correctly
                                yAdjust: 0
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
                                backgroundColor: 'green',
                                color: 'white',
                                font: {
                                    size: 12
                                },
                                xAdjust: 50,  // Adjust this value to position the label correctly
                                yAdjust: 0
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
                                backgroundColor: 'orange',
                                color: 'white',
                                font: {
                                    size: 12
                                },
                                xAdjust: 50,  // Adjust this value to position the label correctly
                                yAdjust: 0
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
                        drag: {
                          enabled: true
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                        threshold: 10
                    },
                },
                legend: {
                    display: true,
                    labels: {
                        color: 'black',
                        font: {
                            size: 14
                        }
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
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log("data");
                            console.log(data);
                            const jsonData = JSON.stringify(data, null, 2);
                            addJsonDetails(jsonData, data.benchmarkTime);
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
    document.getElementById(legendBox).classList.remove('hidden');
});
document.getElementById('compareButton').addEventListener('click', () => {
    chrome.windows.create({
        url: chrome.runtime.getURL('./multiGraph.html'),
        type: 'popup',
        width: 1000,
        height: 900
    }, (response) => {
        window.close();
    });
});

document.getElementById('bookmarkList').addEventListener('click', () => {
    chrome.windows.create({
        url: chrome.runtime.getURL('./removeURL.html'),
        type: 'popup',
        width: 1000,
        height: 900
    });
});

var user_info = {
    uid: '',
    name: ''

}

document.addEventListener('DOMContentLoaded', function () {
    /*
    const option = document.createElement('option');
    option.value = "asfasf";
    option.text = "adsfdf";
    urlSelect.appendChild(option);
    */
    chrome.runtime.sendMessage({
        message: 'load'
    }, async (response) => {
        //  alert(response.uid);
        //  alert(response.name);
        user_info.uid = response.uid;
        user_info.name = response.name;
        console.log(user_info);
        // Fetch initial data to populate dropdown
        fetch('http://localhost:8080/userEntry/url/'+user_info.uid, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.text())
            .then(data => {
                
                // Assuming the response is an array of objects with url and method properties
                console.log("printing data");
                console.log(data);
                // console.log(data.data);
                console.log(JSON.parse(data));
                data = JSON.parse(data);
                console.log(typeof(data));
                
                if (data) {
                    const urlSelect = document.getElementById('urlSelect');
                    console.log(typeof(data));
                    console.log("printing item");
                    // console.log(data[0]);
                    data.forEach(item=>{
                        console.log(item);
                        // console.log(item);
                        const option = document.createElement('option');
                        option.value = JSON.parse(JSON.stringify(item));
                        option.text = JSON.parse(JSON.stringify(item));
                        urlSelect.appendChild(option);
                    })
                    
                    /*data.forEach(item => {
                        const option = document.createElement('option');
                        option.value = item.url;
                        option.text = item.url;
                        urlSelect.appendChild(option);
                    });*/
                }
            })
            .catch(error => console.log(error));
    });
});

document.getElementById('urlSelect').addEventListener('change', function() {
    const selectedUrl = this.value;
    console.log(selectedUrl);
    const methodSelect = document.getElementById('methodSelect');
    /*
    methodSelect.innerHTML = '<option value="" class="methodOption" disabled selected>Select Method</option>'; // Clear previous options
    const option = document.createElement('option');
    option.value = "method";
    option.text = "method";
    methodSelect.appendChild(option);
    methodSelect.style.display = 'inline-block'; // Show the method dropdown 
    */
    
    let body = {
        id : user_info.uid,
        userUrl : selectedUrl
    };
    // Fetch methods based on the selected URL
    fetch(`http://localhost:8080/userEntry/method`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(body)
    })
        .then(response => response.text())
        .then(data => {
            const methodSelect = document.getElementById('methodSelect');
            methodSelect.innerHTML = '<option value="" disabled selected>Select Method</option>'; // Clear previous options
            data = JSON.parse(data);
            if (data) {
                data.forEach(method => {
                    const option = document.createElement('option');
                    option.value = JSON.parse(JSON.stringify(method));
                    option.text = JSON.parse(JSON.stringify(method));
                    methodSelect.appendChild(option);
                });

                methodSelect.style.display = 'inline-block'; // Show the method dropdown
            }
        })
        .catch(error => console.log(error));
        
});

document.getElementById('submitUrl').addEventListener("click", () => {
    const url = document.getElementById("urlSelect").value;
    const method = document.getElementById("methodSelect").value;
    console.log(url, method);
    
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
    })
        .then(response => response.json())
        .then(data => {
            console.log("data");
            console.log(data);
            if (data === null) {
                alert("There are not enough calls");
                data = [{ benchmarkTime: 0, timestamp: 0, id: 0, responseTime: 0 }];
            }
            update(data);
        })
        .catch(error => console.log(error));
});