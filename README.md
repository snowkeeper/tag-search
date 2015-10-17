# tag-search 

Add a html tag search box to your page.  Uses ES6 ReactJS classes to produce a component you can consume into your react app.

There are standalone builds available in the [examples](https://github.com/snowkeeper/tag-search/tree/master/examples) directory.

There are also fully functional builds for System.js and browserify in the examples.

`npm i -g live-server` and run `live-server ./examples` to view the output of different setups.  View the [examples](https://github.com/snowkeeper/tag-search/tree/master/examples) directory for code samples.  

#### Install
##### jspm
```bash
jspm i npm:tag-search
```
##### npm
```
npm i tag-search
```

#### Example
```javascript
import { render } from 'react-dom'
import SearchTags from 'tag-search'

// add the options
let tagOpts = {
	searchBar: 'searchBar',
	placeholder: "quick find",
	searchList: 'searchList',
	tagSelector: 'a[name]',
	contextTextUntilTag: "a[name]",
	nameFromTag: ["H2", "H3", "H4"],
	nameFromNextTag: true,
	nameFromTagAttr: 'name',
	nameFromTagSaveChildren: ':not("em, code")',
	useLocation: true,
    forceSearch: 2000,
	noclasses: false,
	nostyles: false,
	styles: {
		'searchBar': {},
		'input': {},
		'inputDiv': {},
		'searchList': {},
		'ul': {},
		'li': {},
		'li:a': {},
		'li:heading': {},
		'context': {}
	},
	classes: {
		'searchBar': ' col-sm-offset-3 col-sm-9 ',
		'input': ' form-control clearable',
		'ul': ' sidebar-nav ',
	}
}

render( <SearchTags options={tagOpts} {...this.props} />, document.getElementById('anchor-search'));

```  

##### Options  
> **searchBar** - *{String}* - ID of main div  
> **placeholder** - *{String}* - placeholder text  
> **searchList** - *{String}* -  ID of search list div  
> **tageSelector** - *{String}* -  selector of tags to use for search list  
> **contextTextUntilTag** - *{String}* - use the text until this tag is reached for the context string      
> **nameFromTagAttr** - *{String}* -  the attribute to grab the name from   
> **nameFromNextTag** - *{Boolean}* -  get the display name from the next tag   
> **useLocation** - *{Boolean}* -  Use `window.location` instead of scroll  
> **noclasses** - *{Boolean}* -  do **not** include **any** classes   
> **nostyles** - *{Boolean}* -  do **not** include **any** styles  
> **classes** - *{Object}* -  object of classes  
> **styles** - *{Object}* -  object of styles  
> **forceSearch** -  *{Number}* - The amount of time to allow for user input before the search is performed.  The user input is cached until done typing.  The default is to force a render at 2 seconds and start the cache over until typing is finished.

**if `nameFromNextTag == true`**
> > **nameFromTag** - *{Array}* -  name of the tag the get display name from   
> > **nameFromTagSaveChildren**  - *{Boolean}* -  if you use `innerHTML` you may want to include some children    


#####  NOTE  
> If you pass a **react-router** `history` object as a `prop` then the history will be pushed as well.  



#### Default inline styles  
The component will render with these inline styles by default.  Add your style properties with camelCase.  They will be transformed when appropriate.
```javascript
exports.styles = {
	'searchBar': {
		'height': '50px',
		'position': 'fixed',
		'bottom': 0,
		'right': 0,
		'zIndex': 1002,
		'padding': 0,
		'width': '100%'
	},
	'input': {
		'width': '100%',
		'fontSize': '1.4em',
		'fontWeight': 'bold',
		'color': '#555',
		'backgroundColor': '#f7f7f7',
		'border': 'none',
		'height': '50px',
		'zIndex': 1003,
	},
	'inputDiv': {
	    'paddingTop': 0,
		'paddingRight': 0,
		'paddingBottom': 0,
		'paddingLeft': 8,
		'height': '50px',
	},
	'searchList': {
		'height': '300px',
		'margin': '-350px 15px 0 15px',
		'border': '1px solid #ccc',
		'borderBottom': 'none',
		'overflowY': 'auto',
		'backgroundColor': '#fbfbfb',
		'padding': '10px 20px',
		'display': 'none'
	},
	'ul': {
	    'fontSize': '13px',
		'listStyle': 'none',
		'lineHeight': 1.2,
		'margin': '0',
		'padding': 0,
		'position': 'relative',
		'zIndex': 2,
	},
	'li': {
		'padding': '5px 5px',
		'color': '#348dd9',
	},
	'li:a': {
		'color': '#333',
		'display': 'block',
		'padding': '5px 5px 5px 0',
	},
	'li:heading': {
		'fontSize': '1.25em',
		'textTransform': 'uppercase',
        'padding': '5px 5px',
		'color': '#348dd9',
	},
	'context': {
		'color': '#7a7a7a',
		'fontSize': '.9em',
		'display': 'block',
		'marginTop': 0,
		'height': 'auto',
	}

}

```  
#### Default classes
No stylesheet is included by default.  
```javascript
exports.classes = {
	'searchBar': '',
	'input': '',
	'inputDiv': '',
	'searchList': '',
	'ul': '',
	'li': '',
	'li:a': '',
	'li:heading': '',
	'context': ''
}
```
**CAUTION**
If you plan on using your own classes, either through  stylesheet or object,  you **must** send `nostyles: true` or a modified `styles` object with the styles you want removed (or a blank for each property).  If you do not then an inline style **will** take precedence.

