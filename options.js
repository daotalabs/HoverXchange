$(document).ready(function() {
  getCurrenciesFromSettings(populateCurrencyOptions);
  saveSettings();
});

var optionsBody = document.getElementById('optionsBody');
var saveButton = document.getElementById('saveButton');

/*
  Load and initialize dropdowns with Select2.
*/
function populateCurrencyOptions(baseCurrency, displayCurrency) {
  // TODO: load options from separate file
  // $('.singleCurrencySelector').load("currencies.html");
  // $('.multiCurrencySelector').load("currencies.html");
  // console.log($('.multiCurrencySelector').prop('outerHTML'));
  $('.singleCurrencySelector').select2();
  $('.singleCurrencySelector').val(baseCurrency).trigger('change');
  $('.multiCurrencySelector').select2({
    maximumSelectionLength: '3'
  });
  $('.multiCurrencySelector').val(displayCurrency).trigger('change');
}

function saveSettings() {
  /*
    Listen and save enabled setting.
  */
  $('.switch-input').change(function() {
    var checked = $(this).is(':checked');
    chrome.storage.sync.get('xchangeXtensionSettings', function(value) {
      value.xchangeXtensionSettings.enabled = checked;
      chrome.storage.sync.set({'xchangeXtensionSettings': value.xchangeXtensionSettings}, function() {
        console.log('Storing enabled: ' + JSON.stringify(value.xchangeXtensionSettings.enabled));
      })
    });
  });

  /*
    Listen and save update frequency setting.
  */
  $('input[name="radioGetRates"]').change(function() {
    var updateFrequency = $(this).val();
    chrome.storage.sync.get('xchangeXtensionSettings', function(value) {
      value.xchangeXtensionSettings.updateFrequency = updateFrequency;
      chrome.storage.sync.set({'xchangeXtensionSettings': value.xchangeXtensionSettings}, function() {
        console.log('Storing updateFrequency: ' + JSON.stringify(value.xchangeXtensionSettings.updateFrequency));
      })
    });
  });

  /*
    Listen and save base currency settings.
  */
  $('input[name="radioBaseCurrency"]').change(function() {
    var setBaseCurrency = $(this).val();
    chrome.storage.sync.get('xchangeXtensionSettings', function(value) {
      value.xchangeXtensionSettings.setBaseCurrency = setBaseCurrency;
      chrome.storage.sync.set({'xchangeXtensionSettings': value.xchangeXtensionSettings}, function() {
        console.log('Storing setBaseCurrency: ' + JSON.stringify(value.xchangeXtensionSettings.setBaseCurrency));
      })
    });
  });
  $('.singleCurrencySelector').change(function() {
    var baseCurrency = $(this).val();
    chrome.storage.sync.get('xchangeXtensionSettings', function(value) {
      value.xchangeXtensionSettings.baseCurrency = baseCurrency;
      chrome.storage.sync.set({'xchangeXtensionSettings': value.xchangeXtensionSettings}, function() {
        console.log('Storing baseCurrency: ' + JSON.stringify(value.xchangeXtensionSettings.baseCurrency));
      })
    });
  });
  $('.multiCurrencySelector').change(function() {
    var displayCurrency = $(this).val();
    chrome.storage.sync.get('xchangeXtensionSettings', function(value) {
      value.xchangeXtensionSettings.displayCurrency = displayCurrency;
      chrome.storage.sync.set({'xchangeXtensionSettings': value.xchangeXtensionSettings}, function() {
        console.log('Storing displayCurrency: ' + JSON.stringify(value.xchangeXtensionSettings.displayCurrency));
      })
    });
  });

  /*
    Listen and save filtered list setting.
  */
  $('input[name="radioFilteredList"]').change(function() {
    var setFilteredList = $(this).val();
    chrome.storage.sync.get('xchangeXtensionSettings', function(value) {
      value.xchangeXtensionSettings.setFilteredList = setFilteredList;
      chrome.storage.sync.set({'xchangeXtensionSettings': value.xchangeXtensionSettings}, function() {
        console.log('Storing setFilteredList: ' + JSON.stringify(value.xchangeXtensionSettings.setFilteredList));
      })
    });
  });
}

/*
  Wait 500ms for sync storage to be initialized before getting default currencies.
*/
function getCurrenciesFromSettings(callback) {
  setTimeout(function () {
    chrome.storage.sync.get('xchangeXtensionSettings', function(value) {
      if (value.xchangeXtensionSettings == null || Object.keys(value.xchangeXtensionSettings).length == 0) {
        console.log('Default currencies missing. Returning empty currencies.');
        callback('',[]);
      } else {
        // console.log('Getting sync storage: ' + value.xchangeXtensionSettings.baseCurrency + ", " + value.xchangeXtensionSettings.displayCurrency);
        callback(value.xchangeXtensionSettings.baseCurrency, value.xchangeXtensionSettings.displayCurrency);
      }
    })
  }, 500);
}
