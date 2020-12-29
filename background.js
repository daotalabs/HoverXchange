chrome.runtime.onInstalled.addListener(function() {
  console.log("HoverXchangen installation completed.");
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
    chrome.storage.sync.get('HoverXchangeOptions', function(value) {
      if (value.HoverXchangeOptions == null || Object.keys(value.HoverXchangeOptions).length == 0) {
        // Save default options in sync storage
        value.HoverXchangeOptions = {};
        value.HoverXchangeOptions.enabled = true;
        value.HoverXchangeOptions.updateFrequency = '30';
        value.HoverXchangeOptions.displayCurrencies = ['USD', 'CAD', 'VND'];
        saveSyncStorage(value.HoverXchangeOptions)
      }
    })

    chrome.storage.local.get('HoverXchangeRates', function(value) {
      // console.log('HoverXchangeRates is .. ' + JSON.stringify(value.HoverXchangeRates));
      if (value.HoverXchangeRates == null || Object.keys(value.HoverXchangeRates).length == 0) {
        value.HoverXchangeRates = {};
      }
      // Save rates in local storage
      if (isRatesExpired(value.HoverXchangeRates.currentRates)) {
        getNewRates(value.HoverXchangeRates, saveLocalStorage);
      }
    })
  }
})

/*
  Make an API call to Open Exchange Rates API for latest rates.
*/
function getNewRates(HoverXchangeRates, callback) {
  $.get('https://openexchangerates.org/api/latest.json',
  {
    app_id: '68286f83188a46c696bff70ab8df2dce',
    base: 'USD'
  },
  function(response) {
    // console.log('Getting new rates.. ' + JSON.stringify(response));
    HoverXchangeRates.currentRates = response;
    callback(HoverXchangeRates);
  });
}

/*
  Save to Chrome local storage.
*/
function saveLocalStorage(HoverXchangeRates) {
  chrome.storage.local.set({'HoverXchangeRates': HoverXchangeRates}, function() {
    // console.log('Saving to local storage..' + JSON.stringify(HoverXchangeRates));
  })
}

/*
  Save to Chrome sync storage.
*/
function saveSyncStorage(HoverXchangeOptions) {
  chrome.storage.sync.set({'HoverXchangeOptions': HoverXchangeOptions}, function() {
    // console.log('Saving to sync storage..' + JSON.stringify(HoverXchangeOptions));
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
  chrome.storage.sync.get('HoverXchangeOptions', function(value) {
    var updateFrequency = value.HoverXchangeOptions.updateFrequency;
    if (updateFrequency == null) {
      console.warn('Missing updateFrequency')
      return (currentRatesDate < currentDate);
    } else {
      return ((currentRatesDate + parseInt(updateFrequency)) < currentDate);
    }
  });
}

/*
  Change icon upon message.
*/
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === 'makeGray') {
    chrome.browserAction.setIcon({path: "/images/gray/favicon-32x32.png"});
  } else {
    chrome.browserAction.setIcon({path: "/images/favicon-32x32.png"});
  }
});
