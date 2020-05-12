import React from 'react';
import { Divider } from '@blueprintjs/core'
import './App.css'
import { Grid, SpacedColumn, StickyGridColumn } from './components/GlobalStyle/Grid';
import { LayoutColumn } from './components/GlobalStyle/Layout';
import { Header, Country, World, Global } from './components';

function GoPoint() {
	return (
		<div className="App">

			<LayoutColumn>
				<Header/>
				<Grid>
					{/* <SpacedColumn>
						<Menu></Menu>
					</SpacedColumn> */}
					<SpacedColumn>
						<Global/>
						<Divider/>
						<World/>
					</SpacedColumn>

					<StickyGridColumn className='last-column'>
						<Country/>
					</StickyGridColumn>					
				</Grid>
			</LayoutColumn>
		</div>
	);
}

export default GoPoint;
