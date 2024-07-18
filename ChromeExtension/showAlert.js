function retrieveArrays() {
    chrome.storage.local.get(['benchmarkFailed', 'validationFailed'], function(result) {
        let benchmarkFailed = result.benchmarkFailed || [];
        let validationFailed = result.validationFailed || [];
  
        console.log('Retrieved array1:', benchmarkFailed);
        console.log('Retrieved array2:', validationFailed);
    });
  }
retrieveArrays();  