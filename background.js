chrome.runtime.onInstalled.addListener(function() {
  console.log("xchange-xtension installation completed.");
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
    chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
      if (value.xchangeXtensionOptions == null || Object.keys(value.xchangeXtensionOptions).length == 0) {
        // Save default options in sync storage
        value.xchangeXtensionOptions = {};
        value.xchangeXtensionOptions.enabled = true;
        value.xchangeXtensionOptions.updateFrequency = '30';
        value.xchangeXtensionOptions.displayCurrencies = ['USD', 'CAD', 'VND'];
        saveSyncStorage(value.xchangeXtensionOptions)
      }
    })

    chrome.storage.local.get('xchangeXtensionRates', function(value) {
      // console.log('xchangeXtensionRates is .. ' + JSON.stringify(value.xchangeXtensionRates));
      if (value.xchangeXtensionRates == null || Object.keys(value.xchangeXtensionRates).length == 0) {
        value.xchangeXtensionRates = {};
      }
      // Save rates in local storage
      if (isRatesExpired(value.xchangeXtensionRates.currentRates)) {
        getNewRates(value.xchangeXtensionRates, saveLocalStorage);
      }
    })
  }
})

/*
  Make an API call to Open Exchange Rates API for latest rates.
*/
function getNewRates(xchangeXtensionRates, callback) {
  $.get('https://openexchangerates.org/api/latest.json',
  {
    app_id: '68286f83188a46c696bff70ab8df2dce',
    base: 'USD'
  },
  function(response) {
    // console.log('Getting new rates.. ' + JSON.stringify(response));
    xchangeXtensionRates.currentRates = response;
    callback(xchangeXtensionRates);
  });
}

/*
  Save to Chrome local storage.
*/
function saveLocalStorage(xchangeXtensionRates) {
  chrome.storage.local.set({'xchangeXtensionRates': xchangeXtensionRates}, function() {
    // console.log('Saving to local storage..' + JSON.stringify(xchangeXtensionRates));
  })
}

/*
  Save to Chrome sync storage.
*/
function saveSyncStorage(xchangeXtensionOptions) {
  chrome.storage.sync.set({'xchangeXtensionOptions': xchangeXtensionOptions}, function() {
    // console.log('Saving to sync storage..' + JSON.stringify(xchangeXtensionOptions));
  })
}

/*
  Check if current rates in storage is old.
*/
function isRatesExpired(currentRates) {
  if (currentRates == null || currentRates.timestamp == null) {
    return true;
  }
  var currentRatesDate = new Date(currentRates.timestamp * 1000);
  var currentDate = new Date();
  currentDate.setHours(0,0,0,0);
  chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
    var updateFrequency = value.xchangeXtensionOptions.updateFrequency;
    if (updateFrequency == null) {
      console.warn('Missing updateFrequency')
      return (currentRatesDate < currentDate);
    } else {
      return ((currentRatesDate + parseInt(updateFrequency)) < currentDate);
    }
  });
}
