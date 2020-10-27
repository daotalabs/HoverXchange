$(document).ready(function() {
  getSyncPopupOptions(populatePopupOptions);
  savePopupOptions();
});

/*
  Initialize enabled setting.
*/
function populatePopupOptions(enabled) {
  $('.switch-input').prop('checked', enabled);
}

/*
  Get enabled setting from sync storage.
*/
function getSyncPopupOptions(callback) {
  chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
    if (value.xchangeXtensionOptions == null || Object.keys(value.xchangeXtensionOptions).length == 0) {
      console.warn('Missing sync options, populating defaults.');
      callback(true);
    } else {
      // console.log('Getting enabled: ' + value.xchangeXtensionOptions.enabled);
      callback(value.xchangeXtensionOptions.enabled);
    }
  })
}

function savePopupOptions() {
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
    // reload current page for enable switch to work
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
    });
  });
}
