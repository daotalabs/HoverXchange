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
  chrome.storage.sync.get('HoverXchangeOptions', function(value) {
    if (value.HoverXchangeOptions == null || Object.keys(value.HoverXchangeOptions).length == 0) {
      console.warn('Missing sync options, populating defaults.');
      callback(true);
    } else {
      // console.log('Getting enabled: ' + value.HoverXchangeOptions.enabled);
      callback(value.HoverXchangeOptions.enabled);
    }
  })
}

function savePopupOptions() {
  /*
    Listen and save enabled setting.
  */
  $('.switch-input').change(function() {
    var checked = $(this).is(':checked');
    chrome.storage.sync.get('HoverXchangeOptions', function(value) {
      value.HoverXchangeOptions.enabled = checked;
      chrome.storage.sync.set({'HoverXchangeOptions': value.HoverXchangeOptions}, function() {
        // console.log('Storing enabled: ' + JSON.stringify(value.HoverXchangeOptions.enabled));
      })
    });

    // switch icon to gray if disabled
    if (!checked) {
      chrome.runtime.sendMessage({action: 'makeGray'});
    } else {
      chrome.runtime.sendMessage({action: 'makeBlue'});
    }

    // reload current page for enable switch to take effect
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
    });
  });
}
