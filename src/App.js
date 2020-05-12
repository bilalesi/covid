import React from 'react';
import './App.css'
// import { Divider } from '@blueprintjs/core'
// import { Grid, SpacedColumn, StickyGridColumn } from './components/GlobalStyle/Grid';
// import { LayoutColumn } from './components/GlobalStyle/Layout';
// import { Header, Country, World, Global } from './components';
import { BrowserRouter, Route, Switch} from 'react-router-dom'
import GA from './api/googleAnalytics';
import GoPoint from './GoPoint';

function App() {
	return (

		<BrowserRouter>
			{ GA.init() && <GA.RouteTracker/>}
			<Switch>
				<Route path='/' exact component={GoPoint}/>
			</Switch>
		</BrowserRouter>
		// <div className="App">

		// 	<LayoutColumn>
		// 		<Header/>
		// 		<Grid>
		// 			{/* <SpacedColumn>
		// 				<Menu></Menu>
		// 			</SpacedColumn> */}
		// 			<SpacedColumn>
		// 				<Global/>
		// 				<Divider/>
		// 				<World/>
		// 			</SpacedColumn>

		// 			<StickyGridColumn className='last-column'>
		// 				<Country/>
		// 			</StickyGridColumn>					
		// 		</Grid>
		// 	</LayoutColumn>
		// </div>
	);
}

export default App;
