// API calls to get exchange rates

// get mouse pointer position
var mouseX;
var mouseY;
$(document).mousemove(function(e) {
	mouseX = e.pageX; 
	mouseY = e.pageY + 15;
});

var baseCurrency = 'USD'; // this will be determined on domains, etc.
var xCurrencies = ['CAD', 'VND'] // this will be choosen on popup.html or by default

// dynamically get exchange rates
// cache daily rates so that only calls API once a day
fx.base = "USD";
fx.rates = {
	"CAD" : 1.4, 
	"VND" : 23281.5,
	"USD" : 1,        // always include the base rate (1:1)
}

if (document.body != null) {
	// if element hovered over is a money amount, make text box visible at mouse pointer
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
			$("#xchangeBox").css('top', mouseY + 'px');
			$("#xchangeBox").css('left', mouseX + 'px');
			$("#xchangeBox").css('display', 'block');
  		}, function() {
  			$('#xchangeBox').remove();
  		});		
}