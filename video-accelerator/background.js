

function sendCommandToActiveTab (command) {
    chrome.tabs.query({currentWindow: true, active: true}, function (activeTabs) {
        if (activeTabs.length > 0) {
            chrome.tabs.sendMessage(activeTabs[0].id, command);
        }
    });
}

chrome.commands.onCommand.addListener(sendCommandToActiveTab);

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({'url': 'chrome://extensions/shortcuts'});
});
