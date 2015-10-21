import React from 'react'
import $ from 'jquery'
import _ from 'lodash'
import styles,{defaultStyles} from './styles'
import defaultClasses from './classes'
import {EventEmitter} from 'events'
import Debug from 'debug'

let debug = Debug('tag-search');

class Tagged extends React.Component {
	constructor(props){
		super(props)
		this.displayName = 'anchorSearch'
		
		this.state = {}
		
		// private vars
		this._limiters = false
		this._typingBit = false
		this._menuBit = false
		this._tagCache = []
		this._searchTermCache = ''
		
		let opts = ('object' === $.type(props.options)) ? props.options : {}
		
		// Anchored props
		this.state.Anchored = {
			searchBar: opts.searchBar || 'searchBar',
			placeholder: opts.placeholder || "quick find",
			searchList: opts.searchList || 'searchList',
			tagSelector: opts.tagSelector || 'a[name]',
			linkFromTagAttr: opts.linkFromTagAttr || 'name',
			contextTextUntilTag: opts.contextTextUntilTag || "a[name]",
			nameFromTag: opts.nameFromTag || ["H2", "H3", "H4", "H5"],
			nameFromNextTag: opts.nameFromNextTag ? true : false,
			nameFromPrevTag: opts.nameFromPrevTag ? true : false,
			nameFromTagAttr: opts.nameFromTagAttr || 'innerHTML',
			nameFromTagSaveChildren: opts.nameFromTagSaveChildren || ':not("em, code")',
			useLocation: opts.useLocation ? true : false,
			noclasses: opts.noclasses ? true : false,
			nostyles: opts.nostyles ? true : false,
			forceSearch: opts.forceSearch || 2000,
			wrapperLeftText: opts.wrapperLeftText || 'menu',
			wrapperRightText: opts.wrapperRightText || 'search',
			skipHistory: opts.skipHistory || false
		}
		// classes
		this.state.Anchored.classes = this.state.Anchored.noclasses ? defaultClasses : _.defaults(opts.classes || {}, defaultClasses)
		// styles
		this.state.Anchored.styles = this.state.Anchored.nostyles ? defaultStyles :  _.defaults(opts.styles || {}, styles)
		
		this.state.__ANCHOREDr =  location.pathname
		this.state.AnchorSearch =  this.setTagComponent(this.state.Anchored)
		
		$.extend(true, this.state, props)
		
		if(props.events) {
			this.useEvents(props.events)
		}
		
		this.updateConfig = this.updateConfig.bind(this)
	}
	setTagComponent(options) {
		return (
			<div id={options.searchBar} style={options.styles.searchBar}  className={options.classes.searchBar}  >
				<div id="TSWrapper"  style={options.styles.wrapper}>
					<div id="TSWrapperLeft"  style={options.styles.wrapperLeft}>
						<h4>{options.wrapperLeftText}</h4>
					</div>
					<div id="TSWrapperRight"  style={options.styles.wrapperRight}>
						<h4>{options.wrapperRightText}</h4>
					</div>
				</div>
				<div className={options.classes.inputDiv}  style={options.styles.inputDiv}>
					<input style={options.styles.input} type="text" placeholder={options.placeholder} className={options.classes.input} />
					<nav  style={options.styles.searchList} id={options.searchList} className={options.classes.searchList}></nav>
				</div>
				
			</div>
		)
	}
	useEvents(events) {
		events.on('tag-search:update', (cfg) => {
			this.updateConfig(cfg, (options) => {
				events.emit('tag-search:options', options)
			});
		});	
		events.on('tag-search:config', () => {
			events.emit('tag-search:options', this.state.Anchored)
		});		
	}
	updateConfig(cfg, callback) {
		let anchored = _.merge(this.state.Anchored, cfg)
		this._update = true;
		this.setState({
			Anchored: anchored,
			AnchorSearch: this.setTagComponent(anchored)
		})
		if($.isFunction(callback)) {
			callback(anchored)
		}
	}
	render() {
		// return React.cloneElement(Component, this.props)
		return  this.state.AnchorSearch
	}
	componentWillReceiveProps(props) {
		const clean = location.pathname
		if(clean !== this.state.__ANCHOREDr) {
			this.setState({
				__ANCHOREDr: clean
			});
			this._update = true;
		}
	}
	componentDidUpdate() {
		if(this._update) {
			this.onUpdate();
		}
	}
	componentDidMount() {
		this.onUpdate();
		this.onMount();
	}
	onUpdate() {
		let thisComponent = this;
		this._update = false;
		/**
		 * set some values on mount and update
		 * instead of on every listen event
		 * **/
		 thisComponent.setVars()
				
	}
	onMount() {
		let thisComponent = this;
		/**
		 * Search Bar
		 * takes the value from input and first searches for 
		 * a match in anchor names then a full text search
		 * */			
		// catch menu clicks
		$(document).on('click', '.catchMenuClick a', function(e) {
			thisComponent.catchMenuClick(e)
		});
		
		// hide the results when clicked outside
		$(document).on('mouseup','body', function (e)
		{
			thisComponent.hideSearchList(e)
		})
		
		// jump to first anchor on page that matches and give a list of matches
		$(document).on('click input focus', '#' + thisComponent.state.Anchored.searchBar + ' input', function(e) {
			thisComponent.wordWait(e.target.value);		
		});
		// open menu on single click
		$(document).on('click', '#TSWrapperLeft', function(e) {
				thisComponent.checkMenu()	
		});
		// show search on click
		$(document).on('click', '#TSWrapperRight', function(e) {
			thisComponent.checkTyping()			
		});
		
	}
	setVars(options) {
		let thisComponent = this
		thisComponent.$list = $('#' + this.state.Anchored.searchBar + ' #' + this.state.Anchored.searchList)
		thisComponent.$searchDiv = $('#' + this.state.Anchored.searchBar)
		thisComponent.$searchInput = thisComponent.$searchDiv.find('input')
		thisComponent.$allAnchors = $(thisComponent.state.Anchored.tagSelector)
		thisComponent.$wrapper = $('#TSWrapper');
		return true;
	}
	checkTyping() {
		if(this._typingBit) {
			this.disAllowTyping()
		} else {
			this.allowTyping()
		}
	}
	allowTyping() {
		this._typingBit = true
		this.$wrapper.hide()
		this.$searchInput.focus()
	}
	disAllowTyping() {
		this._typingBit = false
		this.$wrapper.show()
		
	}
	checkMenu() {
		if(this._menuBit) {
			this.hideMenu()
		} else {
			this.showMenu()
		}
	}
	showMenu() {
		this._menuBit = true
		this.searchTags(this.$searchInput.val())
	}
	hideMenu() {
		this._menuBit = false
		this.$list.hide();
	}
	catchMenuClick (e) {
		const thisComponent = this
		// catch a menu click and close any menus
		thisComponent.hideMenu();
		thisComponent.disAllowTyping()
		
		// clean search bar status
		thisComponent.$searchInput.css('background-color', styles.input.backgroundColor)
	}
	hideSearchList(e) {
		const thisComponent = this
		const $list = thisComponent.$list
		const $searchDiv = thisComponent.$searchDiv
		
		if ( (!$list.is(e.target) // if the target of the click isn't the container...
			&& $list.has(e.target).length === 0) // ... nor a descendant of the container
			&& (!$searchDiv.is(e.target) // if the target of the click isn't the main div...
			&& $searchDiv.has(e.target).length === 0) // if the target of the click isn't the input...
		) {
			thisComponent.hideMenu();
			$('#' + thisComponent.state.Anchored.searchBar + ' input').css('background-color', styles.input.backgroundColor)
			thisComponent.disAllowTyping()
			return;
		}
	}
	wordWait(entry) {
		const thisComponent = this
		if(!thisComponent._limiters) {
			thisComponent._limiters = {
				typed: entry,
			}
			// open the list
			//debug('entry search')
			return thisComponent.searchTags(entry)
		}
		let useMe = thisComponent._limiters;
		let now = new Date().getTime();
		
		// save the search term until done typing
		useMe.typed = entry
		
		// kill the current interval
		clearTimeout(thisComponent._limiters.interval)
		
		// force search after specified time
		if(useMe.force < now) {
			//debug('force search')
			useMe.force = new Date().getTime() + this.state.Anchored.forceSearch
			thisComponent.searchTags(entry)
			return false
		}
		
		// update the forced search
		useMe.force = new Date().getTime() + this.state.Anchored.forceSearch
		
		// set the interval to run the search
		useMe.interval = setTimeout(function() {
			//debug('interval search')
			thisComponent.searchTags(useMe.typed)
			clearTimeout(thisComponent._limiters.interval)
		},  250)
	}
	searchTags(search) {
		const thisComponent = this
		let $list = thisComponent.$list
		let $searchInput = thisComponent.$searchInput
		let $allAnchors = thisComponent.$allAnchors
		let searchAnchors = {}
		let isWide = (document.body.clientWidth > 480)
		let config = thisComponent.state.Anchored
		// our search term fixed up
		let searchedFor = search.replace('.', ' ').replace('-', ' ').toLowerCase()
		
		let $firstAnchor = false
		
		let aBit = false // bit for anchor presence
		let bBit = false // bit for blob search results presence
		
		$list.html('');
		
		// set display names
		let mainHeader;
		if(location.pathname.search('api') > -1) {
			mainHeader = 'Method'
		} else {
			mainHeader = 'Anchor'
		}
		
		let ustyle = thisComponent.stringClassFromObject(config.styles['li:heading'])
		let uclass = config.classes['li:heading'] 
		
		// create the method ul
		let $ul = $(document.createElement("ul")).css(config.styles.ul).addClass('catchMenuClick ' + config.classes.ul)
		$ul.append('<li class="' + uclass + '" style="' + ustyle + '">' + mainHeader + ' Matches</li>');
		
		// create the search blob ui
		let $ul2 = $(document.createElement("ul")).css(config.styles.ul).addClass('catchMenuClick ' + config.classes.ul)
		$ul2.append('<li class="' + uclass + '" style="' + ustyle + '">Search Matches</li>');
		
		// store all li in case of no matches
		let allAnchors = $(document.createElement("ul")).css(config.styles.ul).addClass('catchMenuClick ' + config.classes.ul)
		allAnchors.append('<li class="' + uclass + '" style="' + ustyle + '">' + mainHeader + 's</li>');
		
		// create search lists
		$allAnchors.each(function(k, v) {
			const $anchor = $(v);
			const text = $anchor.nextUntil(config.contextTextUntilTag).andSelf().text()
			
			// set display names
			let name = $anchor[0][config.linkFromTagAttr] || '';
			let nameFromTag = $anchor[0][config.nameFromTagAttr] || ''
			
			// is the displayed name from the next tag
			let $next = $anchor
			if(config.nameFromNextTag) {
				$next = $anchor.next()
				debug('anchor', 'use next')
			} else if(config.nameFromPrevTag) {
				$next = $anchor.prev()
				debug('anchor', 'use prev')
			}
			
			debug('anchor', name, nameFromTag, $next, $anchor, $.isArray(config.nameFromTag), config.nameFromTag.indexOf($next.prop("tagName")) > -1)
			
			if ($.isArray(config.nameFromTag) && config.nameFromTag.indexOf($next.prop("tagName")) > -1) {
				debug('name from next tag',$next.clone().children(config.nameFromTagSaveChildren).remove().end()[0][config.nameFromTagAttr]) 
				nameFromTag = $next.clone().children(config.nameFromTagSaveChildren).remove().end()[0][config.nameFromTagAttr]
			}
			
			let listyle = thisComponent.stringClassFromObject(config.styles['li'])
			let liclass = config.classes['li'] 
			let astyle = thisComponent.stringClassFromObject(config.styles['li:a'])
			let aclass = config.classes['li:a'] 
			let cstyle = thisComponent.stringClassFromObject(config.styles['context'])
			let cclass = config.classes['context'] 
			
			// large blurb
			const itemDesc = '<li class="' + liclass + '" style="' + listyle + '"><a  class="' + aclass + '" style="' + astyle + '"href="#' + name + '" >' + nameFromTag + '</a><div class="' + cclass + '" style="' + cstyle + '">' + _.trunc(text, {'length': 150,'separator': ' '}) + '</div></li>'
			// smal blurg
			const item = '<li class="' + liclass + '" style="' + listyle + '"><a  class="' + aclass + '" style="' + astyle + '"href="#' + name + '" >' + nameFromTag + '</a><div class="' + cclass + '" style="' + cstyle + '">' + _.trunc(text, {'length': 150,'separator': ' '}) + '</div></li>'
			
			// full text search
			if(searchedFor !== '' && text !== '') {
				let searchArray = searchedFor.split(' ');
				if(!Array.isArray(searchArray)) {
					searchArray = []
				}
				let wordy = searchArray.some(function(word) {
					if(text.toLowerCase().search(word) > -1) {
						$ul2.append(itemDesc)
						return true
					}
					return false
				})
				
			}
			
			// populate method list
			if(searchedFor !== '' && name.replace('-', ' ').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().search(searchedFor) > -1) {
				$ul.append(item)
				if(!$firstAnchor) {
					$firstAnchor = $anchor
				}
			}
			
			allAnchors.append(item)
			
		})
		
		// set blob bit
		bBit = ($ul2[0].childElementCount > 1)
		// set method bit
		aBit = ($ul[0].childElementCount > 1)
		
		if(aBit && $firstAnchor[0].name) {
			
			const goTo = location.pathname + '#' + $firstAnchor[0].name
			
			// do we have history?	
			let pushHistory
			let replaceHistory
			let _history = false
			
			if(!config.skipHistory && 'object' === $.type(thisComponent.props.history)) {
				if($.isFunction(thisComponent.props.history.pushState)) {
					pushHistory = function() {
						debug('push history')
						thisComponent.props.history.pushState(null, goTo)
					}
					replaceHistory = function() {
						debug('replace history')
						thisComponent.props.history.replaceState(null, goTo)
					}
					_history = true
				}
			}
			
			// push the anchor 
			if(!isWide || config.useLocation === false ) {
				// mobiles loses focus on history & location so just move with scrollTop
				$(document).scrollTop($firstAnchor.offset().top)
				if(_history) {
					replaceHistory()
				}
				
			} else {
				// use window and send to history if requested
				window.location.href = goTo;
				if(_history) {
					replaceHistory()
				}
			} 
			
			// we lose focus on mobile when a location change happens
			$searchInput.blur().focus()
			
			// set background to normal
			$searchInput.css('background-color', styles.active.backgroundColor)
			
		} else if(!bBit) {					
			aBit = true
			$ul = allAnchors
			$searchInput.css('background-color', styles.caution.backgroundColor)
		}
		
		// reset the list so scroll goes to top
		$list[0].innerHTML = ''
		if(!isWide || (!bBit || !aBit)) {
			if(aBit) {
				$list.append($ul)
			}
			if(bBit) {
				$list.append($ul2)
			}
		} else {
			// float left methods
			$list.append($(document.createElement("div")).css({float:'left',width:'50%'}).append($ul))
			// float left blob search
			$list.append($(document.createElement("div")).css({float:'left',width:'50%'}).append($ul2))
		}
		
		$list.show()
		
	}
	stringClassFromObject(cobj) {
		let str = '';
		$.each(cobj,function(k,v) {
			if(k) str += _.kebabCase(k) + ':' + v + '; '
		});
		return str
	}
	rateLimited(id, time) {
		/**
		 * keeps a timer per id
		 * returns true if rate limited
		 * returns false if ok to run or new
		 * **/
		let timer = new Date().getTime();
		if('number' === $.type(this._limiters[id] )) {
			if( (timer - this._limiters[id] ) < time ) {
				return true
			} else {
				this._limiters[id]  = timer
				return false
			}
		} else {
			this._limiters[id] = timer
			return false
		}
	}
	
}	
export default Tagged
