[![Discord](https://discordapp.com/api/guilds/323779330033319941/embed.png)](https://discord.gg/J8AqH4A)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/hastebin-gen)
[![npm downloads](https://img.shields.io/npm/dt/hastebin-gen.svg?maxAge=3600)](https://www.npmjs.com/package/hastebin-gen)
[![NPM version](https://badge.fury.io/js/hastebin-gen.svg)](http://badge.fury.io/js/hastebin-gen)
[![Build Status](https://travis-ci.org/MrJacz/hastebin-gen.svg?branch=master)](https://travis-ci.org/MrJacz/hastebin-gen)
[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![dependencies Status](https://david-dm.org/mrjacz/hastebin-gen/status.svg)](https://david-dm.org/mrjacz/hastebin-gen)
[![devDependencies Status](https://david-dm.org/mrjacz/hastebin-gen/dev-status.svg)](https://david-dm.org/mrjacz/hastebin-gen?type=dev)
[![NPM](https://nodei.co/npm/hastebin-gen.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/hastebin-gen/)


# hastebin-gen
A npm module for generating hastebin links. 
https://www.npmjs.com/package/hastebin-gen

## Installation

**NPM:** `npm i hastebin-gen`

**Yarn:** `yarn add hastebin-gen`

# Options

Option      | Type     | Default Value
----------- | -------- | ----------------
`url`       | `string` | `"https://hastebin.com"`
`extension` | `string` | `"js"`

## Examples

**Using .then().catch()**

```javascript
const hastebin = require("hastebin-gen");

// You can change the extension by setting the extension option
hastebin("code", { extension: "txt" }).then(haste => {
    // Logs the created hastebin url to the console
    console.log(haste); // https://hastebin.com/someid.txt
}).catch(error => {
    // Handle error
    console.error(error);
});
```

**Using async/await**

This is assuming that you are in a asynchronous scope

[**Understanding Async/Await**](https://hackernoon.com/understanding-async-await-in-javascript-1d81bb079b2c)

```javascript
const hastebin = require("hastebin-gen");

// You can change the extension by setting the extension option
const haste = await hastebin("code", { extension: "txt" });

// Logs the created hastebin url to the console
console.log(haste); // https://hastebin.com/someid.txt
```

## Example with a custom [**haste-server**](https://github.com/seejohnrun/haste-server) instance

**Using .then().catch()**

```javascript
const hastebin = require("hastebin-gen");

// You can change the extension by setting the extension option
hastebin("code", { url: "https://paste.example.com", extension: "txt" }).then(haste => {
    // Logs the created hastebin url to the console
    console.log(haste); // https://paste.example.com/someid.txt
}).catch(error => {
    // Handle error
    console.error(error);
});
```

**Using async/await**

This is assuming that you are in a asynchronous scope

[**Understanding Async/Await**](https://hackernoon.com/understanding-async-await-in-javascript-1d81bb079b2c)

```javascript
const hastebin = require("hastebin-gen");

// You can change the extension by setting the extension option
const haste = await hastebin("code", { url: "https://paste.example.com", extension: "txt" });

// Logs the created hastebin url to the console
console.log(haste); // https://paste.example.com/someid.txt
```
