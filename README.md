# xchange-xtension
A Google Chrome extension that converts currency amounts on hover using current exchange rates.

### Context
As many souls who have lived abroad know, moving between different countries means that you are constantly doing mental or physical math while online shopping. While this might be beneficial, it certainly is sometimes a real inconvenience. Having the ability to accurately convert currencies on the fly would save us not only time but also brain cells to dedicate to other productive endeavors. Hence this application.

### Main Functionalities:
- Application runs in the browser background on all websites.
- When a user hovers cursor over a money amount, the application displays a tooltip at the cursor position with money amounts in other currencies.
- The available currencies are currently USD, CAD and VND by default.
- Live exchange rates are fetched from [Open Exchange Rates API](https://openexchangerates.org/) and cached daily.

### Limitations & Future Development:
- Let user choose which currencies to display on the extension popup.
- If there is demand for this application, a workaround for the 1000 exchange rates API calls per month quota needs to be explored.

## Installing

### Step 1: Get a copy of xchange_xtension's source code.
Clone this repository into your local machine or download as a zip file and unzip it in your desired directory.

### Step 2: Load the extension on your Chrome browser.
2.1 Open Google Chrome, type `chrome://extensions/` in the address bar and hit enter to open the Extension Settings. 
2.2 Switch to `Developer mode` at the upper right corner of the page if not set already. 
2.3 Click on the `Load unpacked` button, navigate to and select the xchange_xtension's folder. The extension should now appear in your browser.

### Step 3: Test.
That's it! Try openning a website that has money amounts on display (e.g. amazon.com) and test xchange_xtension's functionalities.

## Built With
- JavaScript
- jQuery
- HTML
- CSS

## Contributing

Please read [CONTRIBUTING.md] for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Viet Dao**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
* [Open Exchange Rates API](https://openexchangerates.org/)
* [accounting.js](http://openexchangerates.github.io/accounting.js/#documentation)
* [money.js](http://openexchangerates.github.io/money.js/#basic-install)
