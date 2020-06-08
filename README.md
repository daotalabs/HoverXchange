# xchange-xtension
A Google Chrome extension that converts currency amounts on hover using current exchange rates.

Main Functionalities:
- Application runs in the background on all websites.
- When a user hovers cursor over a money amount, the application displays a tooltip at the cursor position with money amounts in other currencies.
- The available currencies are currently USD, CAD and VND by default.
- The exchange rate is fetched and cached daily.

Limitations and Future Development:
- Let user choose which currencies to display on the extension popup.
- If there is demand for this application, a workaround for the 1000 exchange rates API calls per month needs to be explored.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Have git to clone this repository into your local machine.

### Installing

Step 1: Clone this repository into your local machine.

```
Give the example
```

Step 2: Open Google Chrome and load the extension folder.

```
until finished
```
That's all!

Step 3: Try openning a website that has money amounts on display (eg. amazon.com) and test the functionalities.

## Built With
- JavaScript
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
* Open Exchange Rates API (https://openexchangerates.org/)
* accounting.js (http://openexchangerates.github.io/accounting.js/#documentation)
* money.js (http://openexchangerates.github.io/money.js/#basic-install)
