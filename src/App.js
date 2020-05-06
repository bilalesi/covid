import React from 'react';
import './App.css'
import { Grid, SpacedColumn, StickyGridColumn } from './components/GlobalStyle/Grid';
import { LayoutColumn } from './components/GlobalStyle/Layout';
import { Header, Country } from './components';

function App() {
	return (
		<div className="App">
			<LayoutColumn>
				<Header/>
				<Grid>
					<SpacedColumn>
						
					</SpacedColumn>
					<SpacedColumn>
						ninknlkandlknalsdn
					</SpacedColumn>

					<StickyGridColumn className='last-column'>
						<Country/>
					</StickyGridColumn>					
				</Grid>
			</LayoutColumn>
		</div>
	);
}

export default App;
