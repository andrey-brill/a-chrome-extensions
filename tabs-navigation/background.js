

const commands = {

  'next-tab': function() {
    switchTab(+1);
  },
  'previous-tab': function() {
    switchTab(-1);
  },

  'go-forward': function() {
    chrome.tabs.goForward();
  },
  'go-back': function() {
    chrome.tabs.goBack();
  }
  
}

chrome.commands.onCommand.addListener(function(command) {
  commands[command]();
});

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({'url': 'chrome://extensions/shortcuts'});
});

function switchTab (indexDelta) {
  onActiveTab( function (activeTab) {
    chrome.tabs.query({ currentWindow: true, index: (activeTab.index + indexDelta) }, function (nextTabs) {
      if (nextTabs.length === 1) {
        chrome.tabs.update(nextTabs[0].id, { active: true });
      }
    });  
  });
}

function onActiveTab (handler) {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabsArray) {
    if (tabsArray.length === 1) handler(tabsArray[0]);
  });
}

