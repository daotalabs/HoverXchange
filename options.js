$(document).ready(function() {
  getSyncOptions(populateOptions);
  saveOptions();
});

var optionsBody = document.getElementById('optionsBody');
var saveButton = document.getElementById('saveButton');

/*
  Load and initialize dropdowns with Select2.
*/
function populateOptions(enabled, updateFrequency, displayCurrencies) {
  // TODO: load options from separate file
  // $('.singleCurrencySelector').load("currencies.html");
  // $('.multiCurrencySelector').load("currencies.html");
  // console.log($('.multiCurrencySelector').prop('outerHTML'));
  $('.switch-input').prop('checked', enabled);
  $('input[name="radioGetRates"][value=' + updateFrequency + ']').prop('checked', true);
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
    Listen and save display currency settings.
  */
  $('.multiCurrencySelector').change(function() {
    var displayCurrencies = $(this).val();
    chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
      value.xchangeXtensionOptions.displayCurrencies = displayCurrencies;
      chrome.storage.sync.set({'xchangeXtensionOptions': value.xchangeXtensionOptions}, function() {
        // console.log('Storing displayCurrencies: ' + JSON.stringify(value.xchangeXtensionOptions.displayCurrencies));
      })
    });
  });
}

/*
  Getting options from sync storage.
*/
function getSyncOptions(callback) {
  chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
    if (value.xchangeXtensionOptions == null || Object.keys(value.xchangeXtensionOptions).length == 0) {
      console.warn('Missing sync options, populating defaults.');
      callback(true, '30', ['USD', 'VND', 'CAD']);
    } else {
      // console.log('Getting sync storage: ' + value.xchangeXtensionOptions.baseCurrency + ", " + value.xchangeXtensionOptions.displayCurrency);
      callback(value.xchangeXtensionOptions.enabled,
               value.xchangeXtensionOptions.updateFrequency,
               value.xchangeXtensionOptions.displayCurrencies);
    }
  })
}
