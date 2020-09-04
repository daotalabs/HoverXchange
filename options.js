/*
  Load and initialize dropdowns with Select2.
*/
$(function(){
  $(".singleCurrencySelector").load("currencies.html");
  $(".multiCurrencySelector").load("currencies.html");
});

$(document).ready(function() {
    $('.singleCurrencySelector').select2();
    $('.multiCurrencySelector').select2({
      maximumSelectionLength: '3'
    });
});

var optionsBody = document.getElementById('optionsBody');
var saveButton = document.getElementById('saveButton');

/*
  Listen and save enable/disable switch setting.
*/
$('.switch-input').change(function() {
  var checked = $(this).is(':checked');
  chrome.storage.sync.get('xchangeXtension', function(value) {
    value.xchangeXtension.enabled = checked;
    chrome.storage.sync.set({'xchangeXtension': value.xchangeXtension}, function() {
      // console.log('Saving new xchangeXtension.enabled: ' + JSON.stringify(value.xchangeXtension.enabled));
    })
  });
});

/*
  Listen and save update frequency setting.
*/
$('input[name="radioGetRates"]').change(function() {
  var updateFrequency = $(this).val();
  chrome.storage.sync.get('xchangeXtension', function(value) {
    value.xchangeXtension.updateFrequency = updateFrequency;
    chrome.storage.sync.set({'xchangeXtension': value.xchangeXtension}, function() {
      // console.log('Saving new xchangeXtension.updateFrequency: ' + JSON.stringify(value.xchangeXtension.updateFrequency));
    })
  });
});

/*
  Listen and save base currency setting.
*/
$('input[name="radioBaseCurrency"]').change(function() {
  var setBaseCurrency = $(this).val();
  chrome.storage.sync.get('xchangeXtension', function(value) {
    value.xchangeXtension.setBaseCurrency = setBaseCurrency;
    chrome.storage.sync.set({'xchangeXtension': value.xchangeXtension}, function() {
      console.log('Saving new xchangeXtension.setBaseCurrency: ' + JSON.stringify(value.xchangeXtension.setBaseCurrency));
    })
  });
});

/*
  Listen and save filtered list setting.
*/
$('input[name="radioFilteredList"]').change(function() {
  var setFilteredList = $(this).val();
  chrome.storage.sync.get('xchangeXtension', function(value) {
    value.xchangeXtension.setFilteredList = setFilteredList;
    chrome.storage.sync.set({'xchangeXtension': value.xchangeXtension}, function() {
      console.log('Saving new xchangeXtension.setFilteredList: ' + JSON.stringify(value.xchangeXtension.setFilteredList));
    })
  });
});

// saveButton.addEventListener('click', function() {
// });
