$(document).ready(function() {
  getDisplayCurrencies(populateCurrencyOptions);
  saveOptions();
});

var optionsBody = document.getElementById('optionsBody');
var saveButton = document.getElementById('saveButton');

/*
  Load and initialize dropdowns with Select2.
*/
function populateCurrencyOptions(displayCurrencies) {
  // TODO: load options from separate file
  // $('.singleCurrencySelector').load("currencies.html");
  // $('.multiCurrencySelector').load("currencies.html");
  // console.log($('.multiCurrencySelector').prop('outerHTML'));
  $('.multiCurrencySelector').select2({
    maximumSelectionLength: '3'
  });
  $('.multiCurrencySelector').val(displayCurrencies).trigger('change');
}

function saveOptions() {
  /*
    Listen and save enabled setting.
  */
  $('.switch-input').change(function() {
    var checked = $(this).is(':checked');
    chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
      value.xchangeXtensionOptions.enabled = checked;
      chrome.storage.sync.set({'xchangeXtensionOptions': value.xchangeXtensionOptions}, function() {
        // console.log('Storing enabled: ' + JSON.stringify(value.xchangeXtensionOptions.enabled));
      })
    });
  });

  /*
    Listen and save update frequency setting.
  */
  $('input[name="radioGetRates"]').change(function() {
    var updateFrequency = $(this).val();
    chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
      value.xchangeXtensionOptions.updateFrequency = updateFrequency;
      chrome.storage.sync.set({'xchangeXtensionOptions': value.xchangeXtensionOptions}, function() {
        // console.log('Storing updateFrequency: ' + JSON.stringify(value.xchangeXtensionOptions.updateFrequency));
      })
    });
  });

  /*
    Listen and save base currency settings.
  */
  // $('input[name="radioBaseCurrency"]').change(function() {
  //   var setBaseCurrency = $(this).val();
  //   chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
  //     value.xchangeXtensionOptions.setBaseCurrency = setBaseCurrency;
  //     chrome.storage.sync.set({'xchangeXtensionOptions': value.xchangeXtensionOptions}, function() {
  //       console.log('Storing setBaseCurrency: ' + JSON.stringify(value.xchangeXtensionOptions.setBaseCurrency));
  //     })
  //   });
  // });
  // $('.singleCurrencySelector').change(function() {
  //   var baseCurrency = $(this).val();
  //   chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
  //     value.xchangeXtensionOptions.baseCurrency = baseCurrency;
  //     chrome.storage.sync.set({'xchangeXtensionOptions': value.xchangeXtensionOptions}, function() {
  //       console.log('Storing baseCurrency: ' + JSON.stringify(value.xchangeXtensionOptions.baseCurrency));
  //     })
  //   });
  // });
  $('.multiCurrencySelector').change(function() {
    var displayCurrencies = $(this).val();
    chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
      value.xchangeXtensionOptions.displayCurrencies = displayCurrencies;
      chrome.storage.sync.set({'xchangeXtensionOptions': value.xchangeXtensionOptions}, function() {
        // console.log('Storing displayCurrencies: ' + JSON.stringify(value.xchangeXtensionOptions.displayCurrencies));
      })
    });
  });

  /*
    Listen and save filtered list setting.
  */
  $('input[name="radioFilteredList"]').change(function() {
    var setFilteredList = $(this).val();
    chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
      value.xchangeXtensionOptions.setFilteredList = setFilteredList;
      chrome.storage.sync.set({'xchangeXtensionOptions': value.xchangeXtensionOptions}, function() {
        // console.log('Storing setFilteredList: ' + JSON.stringify(value.xchangeXtensionOptions.setFilteredList));
      })
    });
  });
}

/*
  Wait 500ms for sync storage to be initialized before getting currencies.
*/
function getDisplayCurrencies(callback) {
  setTimeout(function () {
    chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
      if (value.xchangeXtensionOptions == null || Object.keys(value.xchangeXtensionOptions).length == 0) {
        console.warn('Missing sync settings, returning empty currencies');
        callback([]);
      } else {
        // console.log('Getting sync storage: ' + value.xchangeXtensionOptions.baseCurrency + ", " + value.xchangeXtensionOptions.displayCurrency);
        callback(value.xchangeXtensionOptions.displayCurrencies);
      }
    })
  }, 500);
}
