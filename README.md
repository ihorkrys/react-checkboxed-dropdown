# React Checkboxed Dropdown

If is select box component for React 15.
With default styling it checkboxed select box for multichoice drop down, and as native for single.

## Props:
| Name        | Type    | Description                                | Default                      |
|:-----------:|:-------:|:------------------------------------------:|:----------------------------:|
|multiple     | boolean | is multichoice or not.                     | false                        |
|showTitle    | boolean | show tooltip with current value.           | false                        |
|label        | string  | placeholder.                               | "Select"                     |
|clearText    | string  | clear button text.                         | "Remove selection"           |
|closeText    | string  | close button text.                         | "Select"                     |
|changeOnClose| boolean | fire onChange, only after closing dropdown.| false                        |
|children     | array   | array with options.                        | Required                     |
|onChange     | func    | func which will call when value changed.   | Required                     |


Arrays with options should contain items like next:
```javascript
<option value=""></option>
```


## Demo

[Demo link](http://neospyk.github.io/react-checkboxed-dropdown/)


## Installation

```bash
$ npm install react-checkboxed-dropdown --save
```

## Development

```bash
$ git clone git@github.com:neospyk/react-checkboxed-dropdown.git
$ npm install
```

