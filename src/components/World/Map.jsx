import React, { useState } from 'react'
import './style.css'
import {H2, Collapse, Card, Elevation, Switch, HTMLSelect, Callout, Tooltip, Spinner} from '@blueprintjs/core';
import { ResponsiveChoropleth } from '@nivo/geo';
import { useQuery } from 'react-query';
import { baseCountriesStats } from '../../api/endpoints';
import { features } from "../../api/world_countries";
import { Margin10 } from '../GlobalStyle/Margin'
const transformData = (status, data= [], type) => {
    if(status === 'success'){
        return data.map((item, key) => {
            return{
                "id" : item.countryInfo.iso3,
                "value" : item[type]
            }
        })
    }
}
const fetchAllCountriesByType = async (key, type, yesterday) => {
    return ((await fetch(baseCountriesStats+ `?yesterday=${yesterday}&sort=${type}`)).json())
}
const options = [
        { label: 'الحالات الأنية', value :'todayCases'},
        { label: 'الحالات الإجمالية', value :'cases'},
        { label: 'عدد الوفيات', value :'deaths'},
        { label: 'عدد الوفيات الأنية', value :'todayDeaths'},
        { label: 'عدد حالات الإستشفاء', value :'recovered'}
        // { label: 'Today Cases', value :'todayCases'},
        // { label: 'Cases', value :'cases'},
        // { label: 'Deaths', value :'deaths'},
        // { label: 'Today Deaths', value :'todayDeaths'},
        // { label: 'Recovered', value :'recovered'}
    ]
function Map() {
    const [showMap, setShowMap] = useState(true);
    const handleShowMap = () => {
        setShowMap(!showMap);
    }
    const [type, setType] = useState('cases');
    const handleTypeChange = (e) => {
        setType(e.currentTarget.value)
    }
    const [yesterday, setYesterday] = useState(false);
    const handleChangeYesterday = () => {
        setYesterday(!yesterday);
    }
    const {status, data, error} = useQuery(['allCountriesByType', type, yesterday], fetchAllCountriesByType);
    
    return (
        <div>
            <Tooltip content='click to collapse'>
                <H2 onClick={handleShowMap}>World Map</H2>  
            </Tooltip>
            <Margin10/>
            <Collapse isOpen={showMap}>
                <Callout className='options' intent='none'>
                    <HTMLSelect options={options} onChange={handleTypeChange} />
                    <Switch labelElement={<strong>البارحة</strong>} inline={true} large={true} checked={yesterday} onChange={handleChangeYesterday}/>
                </Callout>
                <Margin10/>
                <Card elevation={Elevation.ONE} interactive={true} className='map-canvas'>
                    {  
                        status === 'loading' ? 
                        <Spinner intent='success' size={Spinner.SIZE_LARGE}/>
                        :
                        <ResponsiveChoropleth
                            data={transformData(status, data, type)}
                            features={features}
                            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                            colors="nivo"
                            domain={[ 0, 8000 ]}
                            unknownColor="#666666"
                            label="properties.name"
                            valueFormat=".2s"
                            projectionTranslation={[ 0.5, 0.5 ]}
                            projectionRotation={[ 0, 0, 0 ]}
                            graticuleLineColor="#dddddd"
                            borderWidth={0.5}
                            borderColor="#152538"
                            legends={[
                                {
                                    anchor: 'bottom-left',
                                    direction: 'column',
                                    justify: true,
                                    translateX: 20,
                                    translateY: -100,
                                    itemsSpacing: 0,
                                    itemWidth: 94,
                                    itemHeight: 18,
                                    itemDirection: 'left-to-right',
                                    itemTextColor: '#444444',
                                    itemOpacity: 0.85,
                                    symbolSize: 18,
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemTextColor: '#000000',
                                                itemOpacity: 1
                                            }
                                        }
                                    ]
                                }
                            ]}
                        />
                    }
                </Card>
            </Collapse>
        </div>
    )
}

export default Map
