// API calls to get exchange rates

if (document.body != null) {
	console.log('Creating exchange box now...');
	// add new invisible text box at the end of page
	var exchangeBoxEl = document.createElement('div');
	var exchangeBoxStr = '<div id="xchangeBox"><span class="intro" id="name">Currency box here!</span></div>';
	exchangeBoxEl.innerHTML = exchangeBoxStr;
	document.body.appendChild(exchangeBoxEl.firstChild);	

	// if element hovered over is a money amount, make text box visible at mouse pointer
	// $("#moneyAmount").mouseover(function() {
		// calculate currency amounts and display
    	// $("#xchangeBox").css( "display", "block" );
	// });
}