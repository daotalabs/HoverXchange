// get mouse pointer position
var mouseX;
var mouseY;
$(document).mousemove(function(e) {
	mouseX = e.pageX; 
	mouseY = e.pageY + 15;
});

/* Determine which currency the page is in
	VND: domain .vn, detect Vietnamese, url has /vn/
	CAD: domain .ca, url has /ca/
	USD: default
*/
var websiteCurrency = 'USD';
var fxCurrencies = {};

getWebsiteCurrency();

function getWebsiteCurrency() {
	var currentTabUrl = document.location.href;
	// console.log('currentTabUrl: ' + currentTabUrl);
	if (currentTabUrl.includes('.ca') || currentTabUrl.includes('.ca/') || currentTabUrl.includes('/ca/')) {
		websiteCurrency = 'CAD';
		fxCurrencies['USD'] = '0';
		fxCurrencies['VND'] = '0';
	} else if (currentTabUrl.includes('.vn') || currentTabUrl.includes('.vn/') || currentTabUrl.includes('/vn/')) {
		websiteCurrency = 'VND';
		fxCurrencies['USD'] = '0';
		fxCurrencies['CAD'] = '0';
	} else {
		fxCurrencies['CAD'] = '0';
		fxCurrencies['VND'] = '0';
	}
	// console.log('websiteCurrency: ' + websiteCurrency);
	getExchangeRates();
}

/*
	Get exchange rates from storage API and display currency box.
*/
function getExchangeRates() {
	chrome.storage.sync.get(['current_rates'], function(ratesData) {
    	fx.base = ratesData.current_rates.base;
    	fx.rates = ratesData.current_rates.rates;
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
	Object.keys(fxCurrencies).forEach(function(key) {
		fxCurrencies[key] = formatFx(key, fx.convert(amount, {from: websiteCurrency, to: key}));
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
											fxCurrencies[key] +
							  			  '</span>' +
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
	Format currency amounts correctly according to each's standard.
*/
function formatFx(fxCurrency, fxAmount) {
	switch(fxCurrency) {
	  	case 'CAD':
	    	return accounting.formatMoney(fxAmount,[symbol = 'C$'],[precision = 2],[thousand = ','],[decimal = '.'],[format = '%s%v']);
	    break;
	    case 'VND':
	    	return accounting.formatMoney(fxAmount,[symbol = '₫'],[precision = 0],[thousand = ','],[decimal = '.'],[format = '%s%v']);
	    break;
	  	default:
	    	return accounting.formatMoney(fxAmount,[symbol = 'US$'],[precision = 2],[thousand = ','],[decimal = '.'],[format = '%s%v']);
	}
}