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

var usdPreRegex = /^[^0-9]*(?:\$|USD)\s?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?[^0-9]*$/i;
var usdSubRegex = /^[^0-9]*(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?\s?(?:USD)[^0-9]*$/i;

var cadPreRegex = /^[^0-9]*(?:C\$|CA\$|CDN\$|CAD|CDN)\s?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?[^0-9]*$/i;
var cadSubRegex = /^[^0-9]*(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?\s?(?:CAD|CDN|\$ CA|\$CA)[^0-9]*$/i;

var eurPreRegex = /^[^0-9]*(?:\€|EUR|Eur)\s?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?[^0-9]*$/i;
var eurSubRegex = /^[^0-9]*(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?\s?(?:\€|EUR|EURO|Euro)[^0-9]*$/i;

var vndPreRegex = /^[^0-9]*(?:\₫|VND|VNĐ)\s?(?:\d+|\d{1,3}(?:.\d{3})+)(?:(\.|,)\d+)?[^0-9]*$/i;
var vndSubRegex = /^[^0-9]*(?:\d+|\d{1,3}(?:.\d{3})+)(?:(\.|,)\d+)?\s?(?:\₫|VND|VNĐ)[^0-9]*$/i;

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
		return vndPreRegex.test($(this).text()) || vndSubRegex.test($(this).text());
	}).hover(function() {
		var amount = accounting.unformat($(this).text(), ',');
		// console.log(amount + '; regex tested: ' + $(this).text());
		getFxAmounts(amount, VND, displayCurrencyBox)
	}, function() {
		$('#xchangeBox').remove();
	});

	$(':contains("€"):not(:has(:contains("€"))), :contains("EUR"):not(:has(:contains("EUR"))), :contains("EURO"):not(:has(:contains("EURO"))), :contains("Euro"):not(:has(:contains("Euro")))').filter(function() {
		return eurPreRegex.test($(this).text()) || eurSubRegex.test($(this).text());
	}).hover(function() {
		var amount = accounting.unformat($(this).text());
		// console.log(amount + '; regex tested: ' + $(this).text());
		getFxAmounts(amount, EUR, displayCurrencyBox)
	}, function() {
		$('#xchangeBox').remove();
	});

	$(':contains("CAD"):not(:has(:contains("CAD"))), :contains("CDN"):not(:has(:contains("CDN")))').filter(function() {
		return cadPreRegex.test($(this).text()) || cadSubRegex.test($(this).text());
	}).hover(function() {
		var amount = accounting.unformat($(this).text());
		// console.log(amount + '; regex tested: ' + $(this).text());
		getFxAmounts(amount, CAD, displayCurrencyBox)
	}, function() {
		$('#xchangeBox').remove();
	});

	$(':contains("USD"):not(:has(:contains("USD")))').filter(function() {
		return usdPreRegex.test($(this).text()) || usdSubRegex.test($(this).text());
	}).hover(function() {
		var amount = accounting.unformat($(this).text());
		// console.log(amount + '; regex tested: ' + $(this).text());
		getFxAmounts(amount, USD, displayCurrencyBox)
	}, function() {
		$('#xchangeBox').remove();
	});

	var dollarCurrency = websiteCurrency;
	$(':contains("$"):not(:has(:contains("$")))').filter(function() {
		// filter for currencies that use $ symbol, such as:
		if ($(this).is(':contains("C$"), :contains("CA$"), :contains("CDN$"), :contains("$CA"), :contains("$ CA")')) {
			dollarCurrency = CAD;
			return cadPreRegex.test($(this).text()) || cadSubRegex.test($(this).text());
		}
		return dollarOnlyRegex.test($(this).text());
	}).hover(function() {
		var amount = accounting.unformat($(this).text());
		// console.log(amount + '; regex tested: ' + $(this).text());
		getFxAmounts(amount, dollarCurrency, displayCurrencyBox)
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
