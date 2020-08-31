var optionsBody = document.getElementById('optionsBody');
var saveButton = document.getElementById('saveButton');

/*
  Listen and save enable/disable switch setting.
*/
$('.switch-input').change(function() {
  var checked = $(this).is(':checked');
  chrome.storage.sync.get('xchangeXtension', function(value) {
    // console.log(value.xchangeXtension);
    //   console.log('enabled: ' + checked);
    value.xchangeXtension.enabled = checked;
    // console.log(value.xchangeXtension.enabled);
  });
});

// TODO: n Save, save/update all settings in sync storage
saveButton.addEventListener('click', function() {
  // update rates
  // var updateRate = document.getElementByName();
  console.log($('input[name=radioGetRates]:checked').value);
  // chrome.storage.sync.set({update: updateRate}, function() {
  //   console.log('update rate: ' + updateRate);
  // })
  // base currency
  // chrome.storage.sync.set({baseCurrency: baseCurrency}, function() {
  //   console.log('base currency: ' + baseCurrency);
  // }
  // display currency
  // chrome.storage.sync.set({displayCurrency: displayCurrency}, function() {
  //   console.log('display currency: ' + displayCurrency);
  // }
  // filtered list
  // chrome.storage.sync.set({update: updateRate}, function() {
  //   console.log('update rate: ' + updateRate);
  // }
});


    // const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
    // function constructOptions(kButtonColors) {
    //   for (let item of kButtonColors) {
    //     let button = document.createElement('button');
    //     button.style.backgroundColor = item;
    //     button.addEventListener('click', function() {
    //       chrome.storage.sync.set({color: item}, function() {
    //         console.log('color is ' + item);
    //       })
    //     });
    //     page.appendChild(button);
    //   }
    // }
    // constructOptions(kButtonColors);
