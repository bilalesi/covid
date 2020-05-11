import React, { useState } from 'react'
import { Card, Tooltip, Collapse, H2, Callout, Switch, HTMLSelect} from '@blueprintjs/core';
import { Margin10 } from '../GlobalStyle/Margin';
import { useQuery } from 'react-query';
import { baseCountriesStats } from '../../api/endpoints';
const fetchAllCountries = async (key, type, yesterday) => {
    return (await fetch(baseCountriesStats + ``)).json()
}

const options = [
    { label: 'All', value :'all'},
    { label: 'Africa', value :'africa'},
    { label: 'Asia', value :'asia'},
    { label: 'Europe', value :'europe'},
    { label: 'North America', value :'northAmerica'},
    { label: 'South America', value :'southAmerica'}
]
function Table() {
    const [showTable, setShowTable] = useState(true)
    const handleShowTable = () => {
        setShowTable(!showTable);
    }
    const [yesterday, setYesterday] = useState(false);
    const handleChangeYesterday = () => {
        setYesterday(!yesterday)
    }
    const [type, setType] = useState('all')
    const handleTypeChange = (e) => {
        setType(e.currentTarget.value);
    }
    return (
        <div>
            <Tooltip content='click to collapse'>
                <H2 onClick={handleShowTable}>World Table</H2>  
            </Tooltip>
            <Margin10/>            
            <Collapse isOpen={showTable}>
                <Callout intent='none' className='options'>
                    <HTMLSelect options={options} onChange={handleTypeChange} />
                    <Switch labelElement={<strong>Yesterday</strong>} inline={true} large={true} checked={yesterday} onChange={handleChangeYesterday}/>
                </Callout>
                <Margin10/>
                <Card interactive={true}>

                </Card>
            </Collapse>
        </div>
    )
}

export default Table
