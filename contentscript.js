// API calls to get exchange rates

if (document.body != null) {
	console.log('Creating exchange box now...');
	// add new invisible text box at the end of page
	var exchangeBoxEl = document.createElement('div');
	var exchangeBoxStr = '<div id="xchangeBox"><span class="intro" id="name">Currency box here!</span></div>';
	exchangeBoxEl.innerHTML = exchangeBoxStr;
	document.body.appendChild(exchangeBoxEl.firstChild);	

	// if element hovered over is a money amount, make text box visible at mouse pointer
	// if hover over an element containing $
	$(":contains('$'):not(:has(:contains('$')))").hover(function() {
		// grab the dollar amount and calculate
		var amountUSD = accounting.unformat($(this).text()); // USD default for now
		fx.base = "USD";
		fx.rates = {
			"CAD" : 1.4, // eg. 1 USD === 0.745101 EUR
			"VND" : 23281.5,
			"USD" : 1,        // always include the base rate (1:1)
		}
		var amountCAD = fx.convert(amountUSD, {from: 'USD', to: 'CAD'});
		var amountVND = fx.convert(amountUSD, {from: 'USD', to: 'VND'});
		console.log('Attempting to display box now..' + amountUSD + "USD");
		console.log('Attempting to display box now..' + amountCAD + "CAD");
		console.log('Attempting to display box now..' + amountVND + "VND");
		// insert calculated amount to exchange box
		// display box at mouse pointer
		$("#xchangeBox").css( "display", "block" );
  		}, function() {
  			$("#xchangeBox").css( "display", "none" )
  		});		
}