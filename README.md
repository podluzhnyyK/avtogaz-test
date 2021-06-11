# Avtogaz-test

- Contains configuration for `gulp`, `stylelint`, `eslint`
- CSS preprocessor `SCSS`

## Installation

1. Open terminal in `<your-folder-name>`
2. Run `npm i`

## Commands

`gulp` - run for dev mode with watcher

`gulp --dist` - run for build distribution package (contains minified img, js, css, converts and adds webp to html)

## Folders structure

```
Base template
│   README.md
│   gulpfile.js
│   ...linters...
│   ...
│
└───src
│   └───fonts
│   └───img
│   └───js
│   └───scss
│   └───upload
│   index.html
│   ...
│
└───dist
│   └───fonts
│   └───img
│   └───js
│   └───css
│   └───upload
│   index.html
│   ...
│
└───build
│   └───fonts
│   └───img
│   └───js
│   └───css
│   └───upload
│   index.html
│   ...
│
```
