'strict'

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

exports.defaultStyles = {
	'searchBar': {},
	'input': {},
	'inputDiv': {},
	'searchList': {},
	'ul': {},
	'li': {},
	'li:a': {},
	'li:heading': {},
	'context': {}

}
