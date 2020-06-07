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
var websiteCurrency = 'USD'; // this will be determined on domains, etc.
var xCurrencies = ['CAD', 'VND'] // this will be choosen on popup.html or by default

getExchangeRates();

/*
	Get exchange rates from storage API and display currency box.
*/
function getExchangeRates() {
	chrome.storage.sync.get(['current_rates'], function(ratesData) {
    	console.log('contentscript: Value currently is ' + JSON.stringify(ratesData));
    	fx.base = ratesData.current_rates.base;
    	console.log('contentscript: base currently is ' + fx.base);
    	fx.rates = ratesData.current_rates.rates;
    	console.log('contentscript: rates currently is ' + JSON.stringify(fx.rates));
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
	if (websiteCurrency == 'USD') {
		/* CURRENCY SEARCH:
		if page is USD:
			if innermost element has $..
			if innermost element has only number + immediate outer element has only $
				then get amount
		similarly,
		if page is CAD:
			if innermost element has $../C$../CAD../CAD$..
			if innermost element has only number + immediate outer element has only $/C$/CAD/CAD$
				then get amount
		if page is VND:
			if innermost element has ₫../VND../..₫
			if innermost element has only number + immediate outer element has only ₫/VND
				then get amount
		*/
		$(":contains('$'):not(:has(:contains('$')))").hover(function() { // HACK: if hover over an element containing $
				// grab the dollar amount and calculate
				var amountUSD = accounting.unformat($(this).text());
				var amountCAD = fx.convert(amountUSD, {from: 'USD', to: 'CAD'});
				var amountVND = fx.convert(amountUSD, {from: 'USD', to: 'VND'});

				// create xchange box element
				var exchangeBoxEl = document.createElement('div');
				var exchangeBoxStr = "<div id='xchangeBox'>" +
										"<span id='currency1' class='currency'>" +
											// insert calculated amount to exchange box
											accounting.formatMoney(amountCAD,[symbol = "C$"],[precision = 2],[thousand = ","],[decimal = "."],[format = "%s%v"]) +
										"</span>" +
										"<br>" +
										"<span id='currency2' class='currency'>" + 
											accounting.formatMoney(amountVND,[symbol = "₫"],[precision = 0],[thousand = ","],[decimal = "."],[format = "%s%v"]) +
										"</span>" +
									"</div>";	
				exchangeBoxEl.innerHTML = exchangeBoxStr;
				// add new invisible text box at the end of page
				document.body.appendChild(exchangeBoxEl.firstChild);
				// display box at mouse pointer
				console.log("Creating box with CAD " + amountCAD + " and VND " + amountVND);
				$("#xchangeBox").css('top', mouseY + 'px');
				$("#xchangeBox").css('left', mouseX + 'px');
				$("#xchangeBox").css('display', 'block');
	  		}, function() {
	  			$('#xchangeBox').remove();
	  		});	
	}
	if (websiteCurrency == 'CAD') {

	}	
	if (websiteCurrency == 'VND') {

	}
}