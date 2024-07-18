
// Initial data array

class SlidingWindowMedian {
    constructor(k) {
        this.k = k;
        this.minHeap = [];
        this.maxHeap = [];
    }

     add(num) {
        if (this.maxHeap.length === 0 || num <= this.maxHeap[0]) {
            this.maxHeap.push(num);
            this.maxHeap.sort((a, b) => b - a);
        } else {
            this.minHeap.push(num);
            this.minHeap.sort((a, b) => a - b);
        }

        // Balance the heaps
        if (this.maxHeap.length > this.minHeap.length + 1) {
            this.minHeap.push(this.maxHeap.shift());
            this.minHeap.sort((a, b) => a - b);
        } else if (this.minHeap.length > this.maxHeap.length) {
            this.maxHeap.push(this.minHeap.shift());
            this.maxHeap.sort((a, b) => b - a);
        }
    }

     remove(num) {
        if (num <= this.maxHeap[0]) {
            const index = this.maxHeap.indexOf(num);
            if (index > -1) this.maxHeap.splice(index, 1);
        } else {
            const index = this.minHeap.indexOf(num);
            if (index > -1) this.minHeap.splice(index, 1);
        }

        // Balance the heaps
        if (this.maxHeap.length > this.minHeap.length + 1) {
            this.minHeap.push(this.maxHeap.shift());
            this.minHeap.sort((a, b) => a - b);
        } else if (this.minHeap.length > this.maxHeap.length) {
            this.maxHeap.push(this.minHeap.shift());
            this.maxHeap.sort((a, b) => b - a);
        }
    }

     findMedian() {
        if (this.maxHeap.length === this.minHeap.length) {
            return (this.maxHeap[0] + this.minHeap[0]) / 2;
        } else {
            return this.maxHeap[0];
        }
    }

    async maintainWindow(nums) {
        const result = [];
        for (let i = 0; i < nums.length; i++) {
            this.add(nums[i]);
            if (i >= this.k) {
                this.remove(nums[i - this.k]);
            }
            if (i >= this.k - 1) {
                result.push(this.findMedian());
            }
        }
        return result;
    }
}
// Priority Queue implementation
class PriorityQueue {
    constructor(compare) {
        this.compare = compare;
        this.data = [];
    }

    enqueue(element) {
        this.data.push(element);
        this._heapifyUp(this.data.length - 1);
    }

    dequeue() {
        const result = this.data[0];
        const end = this.data.pop();
        if (this.data.length > 0) {
            this.data[0] = end;
            this._heapifyDown(0);
        }
        return result;
    }

    front() {
        return this.data[0];
    }

    size() {
        return this.data.length;
    }

    _heapifyUp(index) {
        let currentIndex = index;
        while (currentIndex > 0) {
            const parentIndex = Math.floor((currentIndex - 1) / 2);
            if (this.compare(this.data[currentIndex], this.data[parentIndex]) < 0) {
                [this.data[currentIndex], this.data[parentIndex]] = [this.data[parentIndex], this.data[currentIndex]];
                currentIndex = parentIndex;
            } else {
                break;
            }
        }
    }

    _heapifyDown(index) {
        let currentIndex = index;
        const length = this.data.length;
        const element = this.data[currentIndex];

        while (true) {
            let leftChildIndex = 2 * currentIndex + 1;
            let rightChildIndex = 2 * currentIndex + 2;
            let leftChild, rightChild;
            let swapIndex = null;

            if (leftChildIndex < length) {
                leftChild = this.data[leftChildIndex];
                if (this.compare(leftChild, element) < 0) {
                    swapIndex = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                rightChild = this.data[rightChildIndex];
                if (
                    (swapIndex === null && this.compare(rightChild, element) < 0) ||
                    (swapIndex !== null && this.compare(rightChild, leftChild) < 0)
                ) {
                    swapIndex = rightChildIndex;
                }
            }

            if (swapIndex === null) break;
            this.data[currentIndex] = this.data[swapIndex];
            this.data[swapIndex] = element;
            currentIndex = swapIndex;
        }
    }
}

class MinPriorityQueue extends PriorityQueue {
    constructor() {
        super((a, b) => a - b);
    }
}

class MaxPriorityQueue extends PriorityQueue {
    constructor() {
        super((a, b) => b - a);
    }
}


// console.log(result); // This will output the median of the sliding windows

let datasets = [];
let colorIndex = 0;
let size = [];
let newDataset = [];
let rawData = [];
let superImposing = false;
// Color array for different datasets
var chart;
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

async function findSlidingMedianDataSet(){
    console.log(datasets);
    datasets.forEach(item => {
        let tempRawData = [];
        console.log("item : "  );
        item.data.forEach(entry =>{
            console.log("entry : " + entry);
            tempRawData.push(entry.y);
        })
        rawData.push(tempRawData);
        size.push(tempRawData.length);
    })
    // newDataset.data.forEach(item =>{
    //     console.log("item in : data at line 421");
    //     console.log(item.y);
    //     tempRawData.push(item.y);
        
    // })
    // console.log("tempRawData : ");
    // rawData.push(tempRawData);
    // console.log(tempRawData);
    // console.log("rawData");
    // console.log(rawData);
    // console.log("finding median");
    // console.log(rawData);
    // console.log(size);
    size.sort((a, b) => a - b);

    const minimumSize = size[0];
    console.log("minimum size: " + minimumSize);
    newDataset = [];
    console.log("rawData: ");
    console.log(rawData);

    const promises = rawData.map(async (item) => {
        console.log("item for rawData: ");
        console.log(item);
        let sz = item.length;
        console.log(sz);
        const slidingWindowMedian = new SlidingWindowMedian(sz - minimumSize + 1);
        const result =  slidingWindowMedian.maintainWindow(item);
        await result;
        console.log("result");
        result.then(data =>{
            console.log(data);
            console.log(newDataset.push(data));
        })
        
    });

    await Promise.all(promises);
    console.log("newDataset: ");
    console.log(newDataset);
    updateSuperposingChart();
}

const colors = ['blue', 'red', 'green', 'orange', 'purple', 'cyan'];
function normalChart(){
    const ctx = document.getElementById('responseTimeChart').getContext('2d');
    if(chart){
        chart.destroy();
    }
    chart = new Chart(ctx, {
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
}


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
                alert("There are not enough data calls with this network call ");
                data = [{ benchmarkTime: 0, timestamp: 0, id: 0, responseTime: 0 }];
            }
            const color = colors[colorIndex % colors.length];
            colorIndex++;
            const newDataset = createDataset(data, color, `${url}`);
            let tempRawData = [];
            console.log(newDataset);
            
            datasets.push(newDataset);
            updateChart();
        })
        .catch(error => console.log(error));
    });
    /*const option = document.createElement('option');
    option.value = "url";
    option.text = "url";
    urlSelect.appendChild(option);*/
    normalChart();
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

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function updateSuperposingChart(){
    // Function to generate random colors
    console.log("new data set is ");
    console.log(newDataset);
    // Prepare the data for Chart.js
 
   


    // Prepare the data for Chart.js
    const labels = Array.from({length: newDataset[0].length}, (_, i) => i);
    const data = newDataset.map((array, index) => ({
        label: `Dataset ${index + 1}`,
        data: array,
        borderColor: getRandomColor(),
        fill: false
    }));
    
    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: data
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Line Graph for Multiple Datasets'
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true, // Enable zooming with mouse wheel
                        },
                        pinch: {
                            enabled: true // Enable zooming with pinch gesture
                        },
                        drag : {
                            enabled : true
                        },
                        mode: 'xy' // Allow zooming on both axes
                    },
                    pan: {
                        enabled: true, // Enable panning
                        mode: 'xy' // Allow panning on both axes
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Index'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    };
    
    // Render the chart
    if(chart){
        console.log("destroying the chart");
        chart.destroy();
    }
    const ctx = document.getElementById('responseTimeChart').getContext('2d');
    chart = new Chart(ctx, config);
    
}

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


document.getElementById('superImpose').addEventListener("click" , ()=>{
    if(!superImposing){
        superImposing = true;
        findSlidingMedianDataSet();
    }else{
        superImposing = false;
        normalChart();
    }
})
