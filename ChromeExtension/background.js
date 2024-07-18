chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Message received', request);
  if (request.action === 'showNotification') {
      chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'Hello!',
          message: 'This is your notification.'
      }, function(notificationId) {
          console.log('Notification shown', notificationId);
      });
  }
  sendResponse({ status: 'done' });
});
