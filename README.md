# xchange-xtension
A Google Chrome extension that converts currency amounts on hover using current exchange rates.

### Context
As many souls who have lived abroad know, moving between different countries means that you are constantly doing mental or physical math while online shopping. While this might be beneficial, it certainly is sometimes a real inconvenience. Having the ability to accurately convert currencies on the fly would save us not only time but also brain cells to dedicate to other productive endeavors. Hence this application.

### Main Functionalities
- Application runs in the browser background.
- When a user hovers cursor over a money amount, the application displays a tooltip at the cursor position with money amounts in other currencies.
- The available currencies are currently USD, CAD and VND by default.
- Live exchange rates are fetched from [Open Exchange Rates API](https://openexchangerates.org/) and cached daily.

<img src="https://j.gifs.com/Gvk0MK.gif" alt="Demo" width="600"/>

### Future Development
- Ability to enable/disable extension.
- Display current exchange rates (e.g. 1 CAD = 0.75 USD).
- Let user choose which currencies to display on the extension popup.
- For scale, a workaround for the 1000 exchange rates API calls per month quota.
- Test coverage.
- Publish on Chrome Web Store.

## Installing

### Step 1: Get a copy of xchange-xtension's source code.
Clone this repository into your local machine or download as a zip file and unzip it in your desired directory.

### Step 2: Load the extension on your Chrome browser.
2.1 Open Google Chrome, type `chrome://extensions/` in the address bar and hit enter to open the Extension Settings.  
2.2 Switch to `Developer mode` at the upper right corner of the page if not set already.  
2.3 Click on the `Load unpacked` button, navigate to and select the xchange-xtension's folder you just downloaded. The extension should now appear in your browser.

### Step 3: Test.
That's it! Try openning a website that has money amounts on display (e.g. amazon.com) and test xchange-xtension's functionalities.

## Built With
- JavaScript
- jQuery
- HTML
- CSS

## Contributing

Send pull requests. Feel free to implement the features listed in Future Development.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Viet Dao**
* **Lan Dao**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
* [Open Exchange Rates API](https://openexchangerates.org/)
* [accounting.js](http://openexchangerates.github.io/accounting.js/#documentation)
* [money.js](http://openexchangerates.github.io/money.js/#basic-install)
* [Select2](https://select2.org)
