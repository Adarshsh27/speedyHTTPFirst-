// Initial data array
let datasets = [];
let colorIndex = 0;

// Color array for different datasets
const colors = ['blue', 'red', 'green', 'orange', 'purple', 'cyan'];

// Sample data for testing
const sampleData1 = [
    { responseTime: 150, timestamp: 1622559600, id: '1', benchmarkTime: 120 },
    { responseTime: 200, timestamp: 1622563200, id: '2', benchmarkTime: 120 },
    { responseTime: 100, timestamp: 1622566800, id: '3', benchmarkTime: 120 },
];
const sampleData2 = [
    { responseTime: 180, timestamp: 1622559600, id: '4', benchmarkTime: 110 },
    { responseTime: 220, timestamp: 1622563200, id: '5', benchmarkTime: 110 },
    { responseTime: 130, timestamp: 1622566800, id: '6', benchmarkTime: 110 },
];

// Function to create a new dataset object
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

    const urlInput = document.createElement('input');
    urlInput.placeholder = 'Enter URL';
    urlInput.classList.add("inputUrl");

    const methodInput = document.createElement('input');
    methodInput.placeholder = 'Enter Method';
    methodInput.classList.add("inputMethod");

    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.classList.add('input-button');

    const removeButton = document.createElement('button');
    removeButton.textContent = '-';
    removeButton.classList.add('input-button');

    container.appendChild(urlInput);
    container.appendChild(methodInput);
    container.appendChild(addButton);
    container.appendChild(removeButton);
    document.querySelector('.input-container').appendChild(container);

    removeButton.addEventListener('click', () => {
        const index = Array.from(document.querySelectorAll('.input-container .input-group')).indexOf(container);
        datasets.splice(index, 1);
        updateChart();
        container.remove();
    });

    addButton.addEventListener('click', () => {
        // Simulate fetching data from an API using the URL and method
        let url = urlInput.value;
        let method = methodInput.value;

        let message = {
            url: url,
            method: method,
            flag: false,
            uid: user_info.uid
        }
        fetch('http://localhost:8080/networkCalls/plot' ,  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
        .then(response => response.json())
        .then(data => {
            if (data === null || data.status == 500) {
                alert("Enter a URL and Method that you have bookmarked ");
                data = [{ benchmarkTime: 0, timestamp: 0, id: 0, responseTime: 0 }];
            }
            const color = colors[colorIndex % colors.length];
            colorIndex++;
            const newDataset = createDataset(data, color, `Dataset ${colorIndex}`);
            datasets.push(newDataset);
            updateChart();
        })
        .catch(error => console.log(error));
    });
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
        width: 400,
        height: 300
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
