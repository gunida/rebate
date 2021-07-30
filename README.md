# Rebate

## First-time setup

1. Run `npm install`

## Running

1. Put order csv files in input folder
2. run app.js with `node ./app.js`

## Config

config.json constains the configurable options of the app.

organs is an array of the orderable organs.

To change what organ is given as a gift, edit the bonuses in config.json.
It is setup as follows:

```json
"bonuses": { "purchased_organ": ["reward_1", "reward_n"]}
```

Fully processed orders are moved to the folder \processed when finished.

## Improvements

- If an order processes a few rows and then hits an error, we want to revert the order or mark the succesful rows somehow, to not run them again.
- Custom error types for better and more accurate tests "MissingOrganError", "InvalidPriceError", etc.
