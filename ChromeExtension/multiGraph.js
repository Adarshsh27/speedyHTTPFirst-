
// Initial data array
let datasets = [];
let colorIndex = 0;

// Color array for different datasets
function createDataset(data, color, label) {
    // Sort data by timestamp
    let filteredData = data;
    filteredData.sort((a, b) => a.timestamp - b.timestamp);

    return {
        label: label,
        data: filteredData.map(d => {
            let timestamp = d.timestamp;
            if(timestamp > 1e12){
                timestamp /= 1000;
            }
            return ({ x: new Date(timestamp * 1000), y: d.responseTime, id: d.id });
        }),
        borderColor: color,
        borderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 8,
        fill: false,
        backgroundColor: color
    };
}

const colors = ['blue', 'red', 'green', 'orange', 'purple', 'cyan'];

const ctx = document.getElementById('responseTimeChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: datasets
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute'
                },
                title: {
                    display: true,
                    text: 'timestamp'
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
                annotations: []
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
                }
            }
        },
        onClick: (e, elements) => {
            if (elements.length > 0) {
                const datasetIndex = elements[0].datasetIndex;
                const index = elements[0].index;
                const id = datasets[datasetIndex].data[index].id;

                // Simulate an API call to get JSON data
                fetch('http://localhost:8080/networkCalls/' + id ,  {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                      }
                })
                .then(response => response.json())
                .then(data => {
                    const jsonData = JSON.stringify(data , null, 2);
                    addJsonDetails(jsonData);
                })
                .catch(error => console.log(error));
            }
        }
    }
});

document.getElementById('addInput').addEventListener('click', () => {
    const container = document.createElement('div');
    container.classList.add('input-group');

    const urlSelect = document.createElement('select');
    urlSelect.classList.add("url-select");
    urlSelect.innerHTML = '<option value="" disabled selected>Select URL</option>';

    const methodSelect = document.createElement('select');
    methodSelect.classList.add("method-select");
    methodSelect.innerHTML = '<option value="" disabled selected>Select Method</option>';
    methodSelect.style.display = 'none';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.classList.add('input-button');

    const removeButton = document.createElement('button');
    removeButton.textContent = '-';
    removeButton.classList.add('input-button');

    container.appendChild(urlSelect);
    container.appendChild(methodSelect);
    container.appendChild(addButton);
    container.appendChild(removeButton);
    document.querySelector('.input-container').appendChild(container);

    removeButton.addEventListener('click', () => {
        const index = Array.from(document.querySelectorAll('.input-container .input-group')).indexOf(container);
        datasets.splice(index, 1);
        updateChart();
        container.remove();
    });

    urlSelect.addEventListener('change', function() {
        const selectedUrl = this.value;
        console.log(selectedUrl);
        // methodSelect.innerHTML = '<option value="" disabled selected>Select Method</option>'; // Clear previous options
        // const option = document.createElement('option');
        // option.value = "method";
        // option.text = "method";
        // methodSelect.appendChild(option);
        // methodSelect.style.display = 'inline-block'; // Show the method dropdown
        // Fetch methods based on the selected URL


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
                // const methodSelect = document.getElementById('methodSelect');
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
        /*
        

        fetch(`http://localhost:8080/networkCalls/getMethods?url=${encodeURIComponent(selectedUrl)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            methodSelect.innerHTML = '<option value="" disabled selected>Select Method</option>'; // Clear previous options

            if (data.length > 0) {
                data.forEach(method => {
                    const option = document.createElement('option');
                    option.value = method;
                    option.text = method;
                    methodSelect.appendChild(option);
                });

            }
        })
        .catch(error => console.log(error));
        */
    });

    addButton.addEventListener('click', () => {
        const url = urlSelect.value;
        const method = methodSelect.value;

        const message = {
            url: url,
            method: method,
            flag: false,
            uid: user_info.uid
        };

        fetch('http://localhost:8080/networkCalls/plot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
        .then(response => response.json())
        .then(data => {
            if (data === null || data.status == 500) {
                alert("There are not enough network calls with this URL");
                data = [{ benchmarkTime: 0, timestamp: 0, id: 0, responseTime: 0 }];
            }
            const color = colors[colorIndex % colors.length];
            colorIndex++;
            const newDataset = createDataset(data, color, `${url}`);
            datasets.push(newDataset);
            updateChart();
        })
        .catch(error => console.log(error));
    });
    /*const option = document.createElement('option');
    option.value = "url";
    option.text = "url";
    urlSelect.appendChild(option);*/

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
                // const urlSelect = document.getElementById('urlSelect');
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
    // Populate URL dropdown
    /*
    fetch('http://localhost:8080/networkCalls/getUrls', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            data.forEach(url => {
                const option = document.createElement('option');
                option.value = url;
                option.text = url;
                urlSelect.appendChild(option);
            });
        }
    })
    .catch(error => console.log(error));
    */
});

var user_info = {
    uid: '',
    name: ''
}

document.addEventListener('DOMContentLoaded', function() {
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
});

document.getElementById('bookmarkList').addEventListener('click', () => {
    chrome.windows.create({
        url: chrome.runtime.getURL('./removeURL.html'),
        type: 'popup',
        width: 1000,
        height: 900
    });
});

document.getElementById('resetZoomButton').addEventListener('click', () => {
    chart.resetZoom();
});

document.getElementById('clearAllButton').addEventListener('click', () => {
    document.getElementById('dataDetailsContainer').innerHTML = '';
    datasets = [];
    updateChart();
});

function updateChart() {
    chart.data.datasets = datasets;
    chart.update();
}

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
    document.getElementById('dataDetailsContainer').appendChild(jsonBox);
}
