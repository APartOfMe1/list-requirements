
# List-Requirements

An NPM package that will read through a folder and output a sorted list of all requirements for every file in said folder.

## Installation

```bash
npm install list-requirements
```

## Usage

Basic usage:
```js
const listRequirements = require("list-requirements");

listRequirements("./folder/to/check").then(output => {
    console.log(output);
}).catch(err => {
    console.log(err);
});
```

There are also a number of options available:
```js
const listRequirements = require("list-requirements");

listRequirements("./folder/to/check", {
  //Whether to write the results to a json file
  //Defaults to "true"
  outputToFile: true,

  //The location where the output file should be placed, if enabled
  //Defaults to "./" 
  outputLocation: './',

  //An array of regex filters. If a requirement in a
  //file matches one of the filters, it will be ignored
  //Defaults to "null"
  filters: [/fs/g],

  //Whether to log local requirements
  //For example - if disabled - requirements such as "../../test.js" will be ignored
  //Defaults to "false"
  allowLocalReqs: false,

  //An array of filetypes to check. Any files that don't have one of these extensions will be ignored
  //When defining filetypes, be sure to only use the extension name without the "."
  //Defaults to "['js']"
  fileTypes: [ 'js' ]
}).then(output => {
    console.log(output);
}).catch(err => {
    console.log(err);
});

```

## Example Output
`outputPath` will only be provided if `outputToFile` is set to `true`
```
{
  outputPath: 'C:\Users\username\Desktop\requirements.json',
  totalFilesScanned: 80,
  matchingFiles: 72,
  filesWithReqs: 2,
  timeTaken: 134,
  results: [
    {
      name: 'eval',
      fullName: 'eval.js',
      filePath: 'C:\Users\username\Desktop\Test\Scan-This-Folder\eval.js',
      requirements: ["util"]
    },
    {
      name: 'reload',
      fullName: 'reload.js',
      filePath: 'C:\Users\username\Desktop\Test\Scan-This-Folder\reload.js',
      requirements: ["klaw", "system-commands", "chalk"]
    }
  ]
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
