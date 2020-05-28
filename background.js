chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({currency: 'USD'}, function() {
    	console.log("The default currency is USD.");
    });
});
chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
    	conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostContains: "."},
        })],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
});

// listen for hover events