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
		console.log($(this).text());
		console.log('Attempting to display box now..');
		// insert calculated amount to exchange box
		// display box at mouse pointer
		$("#xchangeBox").css( "display", "block" );
  		}, function() {
  			$("#xchangeBox").css( "display", "none" )
  		});
}