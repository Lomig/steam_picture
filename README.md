# Steam Picture

## Summary

Steam provides options to gamedevs to upload a background image and a logo for their games, letting them place the logo and resize it for display in players' library.

This tiny Chrome extension tackles a very specific problem when the gamedevs want to generate the same image for marketing purpose elsewhere.

This is not supposed to be useful for anyone but the person who asked for this helper ☺️

## Tech Stack

* [ESBuild](https://esbuild.github.io)
* [TailwindCSS](https://tailwindcss.com)
* [FileSaver](https://github.com/eligrey/FileSaver.js)
* [HCTI API](https://htmlcsstoimage.com)

## Distribution

* The Chrome extension is not distributed through the Chrome Store.
* There is a missing file for the extension to work as intended:

```javascript
// ./src/javascript/secret/htmlcsstoimage.js

export default {
  url: "https://hcti.io/v1/image",
  userID: "your-user-ID",
  key: "your-api-key"
}
```

## Build Project

```bash
yarn install
yarn build
yarn build:css
```
