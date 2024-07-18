// Function to generate random colors
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
let chart;
function getPerpendicularDistance(point, lineStart, lineEnd) {
    const x0 = point[0];
    const y0 = point[1];
    const x1 = lineStart[0];
    const y1 = lineStart[1];
    const x2 = lineEnd[0];
    const y2 = lineEnd[1];
    const numerator = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
    const denominator = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
    return numerator / denominator;
}

function ramerDouglasPeucker(points, epsilon) {
    if (points.length < 3) {
        return points;
    }

    let dmax = 0;
    let index = 0;
    const end = points.length - 1;

    for (let i = 1; i < end; i++) {
        const d = getPerpendicularDistance(points[i], points[0], points[end]);
        if (d > dmax) {
            index = i;
            dmax = d;
        }
    }

    if (dmax > epsilon) {
        const recResults1 = ramerDouglasPeucker(points.slice(0, index + 1), epsilon);
        const recResults2 = ramerDouglasPeucker(points.slice(index), epsilon);
        
        return recResults1.slice(0, -1).concat(recResults2);
    } else {
        return [points[0], points[end]];
    }
}

// Example usage
const points = [
    [0, 0], [1, 1], [2, 2], [3, 3],
    [4, 4], [5, 5], [6, 6], [7, 7],
    [8, 8], [9, 9], [10, 10]
];
const epsilon = 1.0;
const reducedPoints = ramerDouglasPeucker(points, epsilon);
console.log("reduced ponints");
console.log(reducedPoints);
updateChart(reducedPoints);

function updateChart(newDataset){
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