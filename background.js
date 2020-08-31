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
		chrome.storage.sync.get('xchangeXtension', function(value) {
			if (value.xchangeXtension == null || isRatesExpired(value.xchangeXtension.currentRates)) {
				console.log('Rates expired: ' + isRatesExpired(value) + ', getting current rates..');
				$.get('https://openexchangerates.org/api/latest.json',
					{
						app_id: '68286f83188a46c696bff70ab8df2dce',
						base: 'USD'
					},
					function(response) {
            var current_rates = '{"currentRates" : ' + JSON.stringify(response) + '}';
            chrome.storage.sync.set({'xchangeXtension': JSON.parse(current_rates)}, function() {
            //  chrome.storage.sync.get(function(result){console.log(result)})
		    		//	chrome.storage.sync.set({'current_rates': response}, function() {
							console.log('Saving current rates..' + JSON.stringify(response));
						})
					});
			} else {
				console.log('Rates value currently is ' + JSON.stringify(value));
			}
	    });
	}
})

/*
	Helper function to check if current_rates in storage is old.
*/
function isRatesExpired(currentRates) {
	if (currentRates == null || currentRates.timestamp == null) {
		return true;
	}
	var currentRatesDate = new Date(currentRates.timestamp * 1000);
	var currentDate = new Date();
	currentDate.setHours(0,0,0,0);
	return (currentRatesDate < currentDate);
}
