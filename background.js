chrome.runtime.onInstalled.addListener(function() {
    console.log("xchange_xtension installation completed.");
});

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
    	conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostContains: "."},
        })],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
});

/*
	Listen for tab updates, get and update exchange rates in Chrome sync storage. 
*/
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.status == 'complete' && tab.active) {
		var ratesData = 'sample';
		chrome.storage.sync.get(null, function(items) {
		    var allKeys = Object.keys(items);
		    console.log('current storage: ' + allKeys);
		});
		chrome.storage.sync.get('current_rates', function(value) {
			if (value.current_rates == null) {
				console.log('getting current rates..')
				$.get('https://openexchangerates.org/api/latest.json', 
					{
						app_id: '68286f83188a46c696bff70ab8df2dce', 
						base: 'USD'
					}, 
					function(response) {
		    			console.log("1 US Dollar equals " + response.rates.GBP + " British Pounds");
		    			chrome.storage.sync.set({'current_rates': response}, function() {
							console.log('Saving current rates..' + JSON.stringify(response));
						})
					});
			} else {
				console.log('Value currently is ' + JSON.stringify(value));
			}
	    });
	}
})

/*
	Example message listener.
*/
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//         console.log("background.js got a message");
//         console.log(sender.tab ?
//                 "from a content script:" + sender.tab.url :
//                 "from the extension");

//         sendResponse({siteCurrency: setWebsiteCurrency(sender.tab.url)});
//     }
// );