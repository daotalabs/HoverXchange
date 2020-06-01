// API calls to get exchange rates

// get mouse pointer position
var mouseX;
var mouseY;
$(document).mousemove(function(e) {
	mouseX = e.pageX + 10; 
	mouseY = e.pageY + 10;
});

var baseCurrency = 'USD'; // this will be determined on domains, etc.
var xCurrencies = ['CAD', 'VND'] // this will be choosen on popup.html or by default

fx.base = "USD";
fx.rates = {
	"CAD" : 1.4, 
	"VND" : 23281.5,
	"USD" : 1,        // always include the base rate (1:1)
}

if (document.body != null) {
	console.log('Creating exchange box now...');

	// if element hovered over is a money amount, make text box visible at mouse pointer
	$(":contains('$'):not(:has(:contains('$')))").hover(function() { // HACK: if hover over an element containing $
		// grab the dollar amount and calculate
			var amountUSD = accounting.unformat($(this).text());
			var amountCAD = fx.convert(amountUSD, {from: 'USD', to: 'CAD'});
			var amountVND = fx.convert(amountUSD, {from: 'USD', to: 'VND'});

			// create xchange box element
			var exchangeBoxEl = document.createElement('div');
			var exchangeBoxStr = "<div id='xchangeBox'>" +
									"<span id='currency1' class='currency'>CAD" + amountCAD + "</span>" +
									"<br>" +
									"<span id='currency2' class='currency'>VND" + amountVND + "</span>" +
								"</div>";	
			exchangeBoxEl.innerHTML = exchangeBoxStr;
			// add new invisible text box at the end of page
			document.body.appendChild(exchangeBoxEl.firstChild);	
			console.log('Attempting to display box now..' + amountUSD + "USD");
			console.log('Attempting to display box now..' + amountCAD + "CAD");
			console.log('Attempting to display box now..' + amountVND + "VND");
			// insert calculated amount to exchange box

			// display box at mouse pointer
			console.log('Pointer is at left: ' + mouseX + ", top: " + mouseY);
			$("#xchangeBox").css('top', mouseY + 'px');
			$("#xchangeBox").css('left', mouseX + 'px');
			$("#xchangeBox").css('display', 'inline-block');
  		}, function() {
  			$('#xchangeBox').remove();
  		});		
}