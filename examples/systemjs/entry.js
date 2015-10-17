import { render } from 'react-dom'
import React from 'react'
import Anchor from 'app'

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


