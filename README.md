### About  
This script parses byte-offset encoded data files into csvs.

### Installation  
- Make sure you have [node.js](https://nodejs.org) installed
- Clone or download this repository to your computer
- In terminal, navigate to the downloaded directory and run `npm install`

### Usage
- Place all files that you want to transform in the `inputs` directory. They must all have the same schema.
- In `config.json`, specify a valid JSON object with two properties:
    - `ignoreEndCharacters`: the number of characters that you want to ignore at the end of every line, including whitespace and line break characters
    - `columns`: an array of objects, each with a `name` property (the name to give the column) and a `length` property, the number of characters to allocate to that field.
- Please see the examples directory for an example
- Navigate to this directory in terminal, and run `npm start`
