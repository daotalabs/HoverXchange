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
			if (value.current_rates == null || isRatesExpired(value)) {
				console.log('getting current rates..' + isRatesExpired(value));
				$.get('https://openexchangerates.org/api/latest.json', 
					{
						app_id: '68286f83188a46c696bff70ab8df2dce', 
						base: 'USD'
					}, 
					function(response) {
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
	Helper function to check if current_rates in storage is old.
*/
function isRatesExpired(value) {
	if (value.current_rates == null || value.current_rates.timestamp == null) {
		return true;
	}
	var currentRatesDate = new Date(value.current_rates.timestamp * 1000);
	var currentDate = new Date();
	currentDate.setHours(0,0,0,0);
	console.log('currentRatesDate: ' + currentRatesDate + ' , currentDate: ' + currentDate);
	return (currentRatesDate < currentDate);
}