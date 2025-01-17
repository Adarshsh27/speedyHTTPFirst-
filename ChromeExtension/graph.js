// const { _connectToCdpBrowser } = require("puppeteer");

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
document.getElementById("urlSubmit").addEventListener("click" , ()=>{
    let url = document.getElementById("getUrl").value;
    let method = document.getElementById("getMethod").value;
    plot(url , method);
})
// plot("https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener");
async function plot(url , method){
    document.body.style.width = 900 + 'px';
    document.body.style.height = 900 + 'px';
    console.log("hashID : " + url + " method : " + method);
    const apiEndpoint = 'http://localhost:8080/networkCalls/plot';
    fetch(
        apiEndpoint , {
            method : "POST",
            headers: {
                'Content-Type':'application/json',
            },
            body : JSON.stringify({
              url : url,
              method : method,
              uid : user_info.uid,
              flag : false
                // urlHash : hashId
            })
        }
        )
      .then(response => response.json())
      .then(data => {
        console.log("we got the data");
        const labels = data.map(item => item.timestamp); 
        const values = data.map(item => item.responseTime);
        console.log(labels);
        console.log(values);

        const dataPoints = labels.map((label, index) => {
            const date = new Date(parseInt(label));
    
            return {
              x: date,
              y: values[index]
            };
          });
        
          // Create the scatter plot
          const ctx = document.getElementById('myChart').getContext('2d');
          new Chart(ctx, {
            type: 'line',
            data: {
              datasets: [{
                label: 'Scatter Dataset',
                data: dataPoints,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
              }]
            },
            options: {
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'day',
                    tooltipFormat: 'MMM DD, YYYY'
                  },
                  title: {
                    display: true,
                    text: 'Date'
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Response Time'
                  }
                }
              }
            }
          });              
    }
    )
    .catch(error => console.error('Error fetching data:', error));    
};
async function sha256(message) {
    // Encode the message as an array of bytes
    const msgBuffer = new TextEncoder().encode(message);
  
    // Hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
    // Convert the ArrayBuffer to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}
async function getHashId(url , method){
    const urlObj = new URL(url);
    
    // Extract the domain (hostname)
    const domain = urlObj.hostname;
    
    // Extract the path
    const path = urlObj.pathname;
    
    // Extract query parameters
    const queryParams = new URLSearchParams(urlObj.search);
    let urlToHash = "*://";
    urlToHash += domain;
    urlToHash += path;
    urlToHash += "*/";
    
    // Convert query parameters to an object
    // const queryParamsObj = {};
    // queryParams.forEach((value, key) => {
    //     queryParamsObj[key] = value;
    // });
    
    const queryParamsMap = new Map();
    queryParams.forEach((value, key) => {
        queryParamsMap.set(key, value);
    });
    
    
    // Sort the keys
    let flag = false;
    const sortedKeys = Array.from(queryParamsMap.keys()).sort();
    sortedKeys.forEach(x =>{
        urlToHash += x + "/";
        flag = true;
    });

    if(flag === true){
     urlToHash = urlToHash.slice(0, -1);
  
    }
    
    urlToHash += "/" + method;
   
    console.log("our final urlToHash");
    console.log(urlToHash);
      let hashId = sha256(urlToHash).then(value => {
        console.log("hashid we getting : " + value);
        plot(value);
      });

}

document.getElementById("goBack").addEventListener("click" , ()=>{
    chrome.runtime.sendMessage({
        message : "goBack"
    }, (response) =>{
        if(response.message === 'success'){
            window.close();
        }
    });
}); 

  

