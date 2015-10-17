// global holdovers
import { render } from 'react-dom'
import React from 'react'
import Anchor from '../../lib/anchored.js'

class App extends React.Component {
		constructor(){
			super()
			this.state = {}
		}
		render() {
			return <Anchor />
		}
}
render( <App />, document.getElementById('anchor-search'));


