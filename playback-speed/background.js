

const commands = {
  'video-speed-up': function() {
    sendCommandToContentScript('video-speed-up');
  },
  'video-slow-down': function() {
    sendCommandToContentScript('video-slow-down');
  },
  'video-max-speed': function() {
    sendCommandToContentScript('video-max-speed');
  }
}

chrome.commands.onCommand.addListener(function(command) {
  commands[command]();
});

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({'url': 'chrome://extensions/shortcuts'});
});

function sendCommandToContentScript (command) {
  onActiveTab( activeTab => chrome.tabs.sendMessage(activeTab.id, { command }) );
}

function onActiveTab (handler) {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabsArray) {
    const activeTab = tabsArray[0];
    if (activeTab) handler(activeTab);
  });
}
