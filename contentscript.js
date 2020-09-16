/*
	Get mouse pointer position to show xchangeBox.
*/
var mouseX;
var mouseY;
$(document).mousemove(function(e) {
	mouseX = e.pageX;
	mouseY = e.pageY + 15;
});

var websiteCurrency = 'USD';
var fxCurrencies = {};
var displayCurrencies = [];

/*
	Check if extension is enabled before running anything.
*/
chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
	if (value.xchangeXtensionOptions == null || Object.keys(value.xchangeXtensionOptions).length == 0) {
		console.error('Missing sync settings, stopping..');
		return;
	}
	if (value.xchangeXtensionOptions.enabled) {
		getDisplayCurrencies(getWebsiteCurrency);
	}
})

/*
	Get currencies from sync storage.
*/
function getDisplayCurrencies(callback) {
	chrome.storage.sync.get('xchangeXtensionOptions', function(value) {
		if (value.xchangeXtensionOptions == null || Object.keys(value.xchangeXtensionOptions).length == 0) {
			console.error('Missing sync settings, stopping..');
		} else {
			displayCurrencies = value.xchangeXtensionOptions.displayCurrencies;
			callback();
		}
	})
}

/* Determine which currency the page is in
	VND: domain .vn, detect Vietnamese, url has /vn/
	CAD: domain .ca, url has /ca/
	USD: default
*/
function getWebsiteCurrency() {
	var currentTabUrl = document.location.href;
	// console.log('currentTabUrl: ' + currentTabUrl);
	if (currentTabUrl.includes('.ca') || currentTabUrl.includes('.ca/') || currentTabUrl.includes('/ca/')) {
		websiteCurrency = 'CAD';
	} else if (currentTabUrl.includes('.vn') || currentTabUrl.includes('.vn/') || currentTabUrl.includes('/vn/')) {
		websiteCurrency = 'VND';
	}
	displayCurrencies.forEach(function (displayCurrency, index, array) {
		if (websiteCurrency.localeCompare(displayCurrency) != 0) {
			fxCurrencies[displayCurrency] = '0';
		}
	});
	getExchangeRates();
}

/*
	Get exchange rates from sync storage and display currency box.
*/
function getExchangeRates() {
	chrome.storage.local.get('xchangeXtensionRates', function(value) {
    fx.base = value.xchangeXtensionRates.currentRates.base;
  	fx.rates = value.xchangeXtensionRates.currentRates.rates;
  	createCurrencyBox();
	});
}

/*
	Display currency box on hover over a currency amount.
*/
function createCurrencyBox() {
	if (document.body == null) {
		return;
	}
	// regexes for currency search
	var dollarOnlyRegex = /^[^0-9]*\$-?\s?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?[^0-9]*$/i;
	var dongPreOnlyRegex = /^[^0-9]*\₫\s?(?:\d+|\d{1,3}(?:.\d{3})+)(?:(\.|,)\d+)?[^0-9]*$/i;
	var dongSubOnlyRegex = /^[^0-9]*(?:\d+|\d{1,3}(?:.\d{3})+)(?:(\.|,)\d+)?\s?\₫[^0-9]*$/i;
	/* CURRENCY SEARCH:
		if page is VND:
			[done] if innermost element has ₫(number)/(number)₫ surrounded by non-integer characters
			[later] if innermost element has (number)K(space) surrounded by non-integer characters
			[later] if highlighted
			[later] if innermost element has only number + immediate outer element has only ₫/VND
				then get amount
		if page is USD:
			[done] if innermost element has $(number) or $(number) surrounded by non-integer characters
			[later] if highlighted
			[later-maybe] if innermost element has only number + immediate outer element has only $
				then get amount
		similarly,
		if page is CAD:
			[done] if innermost element has $(number) or $(number) surrounded by non-integer characters
			[later] if highlighted
			[later] if innermost element has CAD(number) surrounded by non-integer characters
			[later-maybe] if innermost element has only number + immediate outer element has only $/C$/CAD/CAD$
				then get amount
	*/
	if (websiteCurrency == 'VND') {
		$(':contains("₫"):not(:has(:contains("₫")))').filter(function() {
			return dongPreOnlyRegex.test($(this).text()) || dongSubOnlyRegex.test($(this).text());
		}).hover(function() {
			var amount = accounting.unformat($(this).text(), ',');
			// console.log(amount + '; regex tested: ' + $(this).text());
			getFxAmounts(amount, displayCurrencyBox)
		}, function() {
			$('#xchangeBox').remove();
		});
	} else {
		$(':contains("$"):not(:has(:contains("$")))').filter(function() {
			return dollarOnlyRegex.test($(this).text());
		}).hover(function() {
			var amount = accounting.unformat($(this).text());
			//console.log(amount + '; regex tested: ' + $(this).text());
			getFxAmounts(amount, displayCurrencyBox)
		}, function() {
			$('#xchangeBox').remove();
		});
	}
}

/*
	Convert default website currency to other currencies.
*/
function getFxAmounts(amount, callback){
	Object.keys(fxCurrencies).forEach(function(displayCurrency) {
		fxCurrencies[displayCurrency] = formatFx(displayCurrency, fx.convert(amount, {from: websiteCurrency, to: displayCurrency}));
		// console.log(key, fxCurrencies[key]);
	});
	callback(fxCurrencies);
}

/*
	Create and display currency box.
*/
function displayCurrencyBox(fxCurrencies) {
	var exchangeBoxEl = document.createElement('div');
	var exchangeBoxStr = '<div id="xchangeBox">';
	Object.keys(fxCurrencies).forEach(function(key) {
		exchangeBoxStr = exchangeBoxStr + '<span class="currency">' +
										 fxCurrencies[key] + '</span>' +
							  		 '<br>';
	});
	exchangeBoxStr = exchangeBoxStr + '</div>';
	exchangeBoxEl.innerHTML = exchangeBoxStr;
	// add new invisible box at the end of page
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
