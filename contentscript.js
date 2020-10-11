var VND = 'VND';
var USD = 'USD';
var CAD = 'CAD';
var EUR = 'EUR';
var websiteCurrency = 'USD';
var fxCurrencies = {};
var displayCurrencies = [];

/*
	Regexes for currency search. https://regex101.com for help.
*/
var dollarOnlyRegex = /^[^0-9]*\$-?\s?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?[^0-9]*$/i;
var dongPreOnlyRegex = /^[^0-9]*(?:\₫|VND|VNĐ)\s?(?:\d+|\d{1,3}(?:.\d{3})+)(?:(\.|,)\d+)?[^0-9]*$/i;
var dongSubOnlyRegex = /^[^0-9]*(?:\d+|\d{1,3}(?:.\d{3})+)(?:(\.|,)\d+)?\s?(?:\₫|VND|VNĐ)[^0-9]*$/i;

/*
	Get mouse pointer position to show xchangeBox.
*/
var mouseX;
var mouseY;
$(document).mousemove(function(e) {
	mouseX = e.pageX;
	mouseY = e.pageY + 15;
});

/*
	Check if extension is enabled before running anything.
*/
chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
	if (value.xchangeXtensionOptions == null || Object.keys(value.xchangeXtensionOptions).length == 0) {
		console.error('Missing sync settings, stopping..');
		return;
	}
	if (value.xchangeXtensionOptions.enabled) {
		getDisplayCurrencies();
		getWebsiteCurrency(getExchangeRates);
	}
})

/*
	Get currencies from sync storage.
*/
function getDisplayCurrencies() {
	chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
		if (value.xchangeXtensionOptions == null || Object.keys(value.xchangeXtensionOptions).length == 0) {
			console.error('Missing sync settings, stopping..');
		} else {
			displayCurrencies = value.xchangeXtensionOptions.displayCurrencies;
			displayCurrencies.forEach(function (displayCurrency, index, array) {
				fxCurrencies[displayCurrency] = '0';
			});
		}
	})
}

/* Determine which currency the page is in
	VND: domain .vn, detect Vietnamese, url has /vn/
	CAD: domain .ca, url has /ca/
	USD: default
*/
function getWebsiteCurrency(callback) {
	var currentTabUrl = document.location.href;
	// console.log('currentTabUrl: ' + currentTabUrl);
	if (currentTabUrl.includes('.ca') || currentTabUrl.includes('.ca/') || currentTabUrl.includes('/ca/')) {
		websiteCurrency = CAD;
	} else if (currentTabUrl.includes('.vn') || currentTabUrl.includes('.vn/') || currentTabUrl.includes('/vn/')) {
		websiteCurrency = VND;
	}
	callback();
}

/*
	Get exchange rates from sync storage and display currency box.
*/
function getExchangeRates() {
	chrome.storage.local.get('xchangeXtensionRates', function(value) {
    fx.base = value.xchangeXtensionRates.currentRates.base;
  	fx.rates = value.xchangeXtensionRates.currentRates.rates;
	});
	createCurrencyBox();
}

/*
	Display currency box on hover over a currency amount.
*/
function createCurrencyBox() {
	if (document.body == null) {
		return;
	}
	$(':contains("₫"):not(:has(:contains("₫"))), :contains("VND"):not(:has(:contains("VND"))), :contains("VNĐ"):not(:has(:contains("VNĐ")))').filter(function() {
		return dongPreOnlyRegex.test($(this).text()) || dongSubOnlyRegex.test($(this).text());
	}).hover(function() {
		var amount = accounting.unformat($(this).text(), ',');
		// console.log(amount + '; regex tested: ' + $(this).text());
		getFxAmounts(amount, VND, displayCurrencyBox)
	}, function() {
		$('#xchangeBox').remove();
	});

	$(':contains("$"):not(:has(:contains("$")))').filter(function() {
		return dollarOnlyRegex.test($(this).text());
	}).hover(function() {
		var amount = accounting.unformat($(this).text());
		console.log(amount + '; regex tested: ' + $(this).text());
		getFxAmounts(amount, websiteCurrency, displayCurrencyBox)
	}, function() {
		$('#xchangeBox').remove();
	});
}

/*
	Convert default website currency to other currencies.
*/
function getFxAmounts(amount, baseCurrency, callback){
	Object.keys(fxCurrencies).forEach(function(displayCurrency) {
		fxCurrencies[displayCurrency] = formatFx(displayCurrency, fx.convert(amount, {from: baseCurrency, to: displayCurrency}));
		// console.log(key, fxCurrencies[key]);
	});
	callback(fxCurrencies, baseCurrency);
}

/*
	Create and display currency box.
*/
function displayCurrencyBox(fxCurrencies, baseCurrency) {
	var exchangeBoxEl = document.createElement('div');
	var exchangeBoxStr = '<div id="xchangeBox">';
	Object.keys(fxCurrencies).forEach(function(key) {
		if (key.localeCompare(baseCurrency) != 0) {
			exchangeBoxStr = exchangeBoxStr + '<span class="currency">' +
											 fxCurrencies[key] + '</span>' +
								  		 '<br>';
		}
	});
	exchangeBoxStr = exchangeBoxStr + '</div>';
	exchangeBoxEl.innerHTML = exchangeBoxStr;
	document.body.appendChild(exchangeBoxEl.firstChild);
	// display box slightly below mouse pointer
	$('#xchangeBox').css('top', mouseY + 'px');
	$('#xchangeBox').css('left', mouseX + 'px');
	$('#xchangeBox').css('display', 'block');
}

/*
	Format currency amounts correctly according to each currency's standard.
*/
function formatFx(displayCurrency, fxAmount) {
	switch(displayCurrency) {
		case 'VND':
			return accounting.formatMoney(fxAmount,[symbol = displayCurrency + ' '],[precision = 0],[thousand = '.'],[decimal = ','],[format = '%s%v']);
		default:
			return accounting.formatMoney(fxAmount,[symbol = displayCurrency + ' '],[precision = 2],[thousand = ','],[decimal = '.'],[format = '%s%v']);
	}
}
