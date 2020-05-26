// API calls to get exchange rates

// add new invisible text box at the end of page

// when hover over a money amount, make text box visible
document.onload = function() {
	console.log('loading...');
	if (document.body != null) {
		var exchangeValues = document.createElement("div"); 
		exchangeValues.textContent('viet dao');
	    document.body.appendChild(exchangeValues);
	}
}

// if some currency is enabled, use exchange rate to calculate