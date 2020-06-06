chrome.runtime.onInstalled.addListener(function() {
    console.log("xchange_xtension installation completed.");
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	// If local/sync storage has current rates, skip API calls
	console.log('tab updated: #' + tabId);
	if (changeInfo.status == 'complete' && tab.active) {
		var ratesData = 'sample';
		console.log('checking storage..');
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
						ratesData = JSON.stringify(response);
		    			console.log("1 US Dollar equals " + response.rates.GBP + " British Pounds");
		    			chrome.storage.sync.set({'current_rates': response}, function() {
							console.log('Saving current rates..' + ratesData);
						})
					});
			} else {
				console.log('Value currently is ' + value.current_rates.toString());
			}
	    });
	}
	// API calls to get exchange rates

	// Save rates to storage
	
})

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
    	conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostContains: "."},
        })],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
});