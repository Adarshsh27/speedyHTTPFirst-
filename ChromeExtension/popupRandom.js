document.getElementById('notifyButton').addEventListener('click', function() {
    console.log('Button clicked');
    chrome.runtime.sendMessage({ action: 'showNotification' }, function(response) {
        console.log('Message sent', response);
    });
});
