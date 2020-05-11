import React, { useState, useEffect } from 'react'
import { useQuery, queryCache } from 'react-query';
import './Country.css';


import { Card, Elevation, H5, Button, Divider, Callout, MenuItem, Classes, Dialog, Tooltip, Spinner, Popover, PopoverInteractionKind, Intent, Tag, Icon, Switch } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { DateRangePicker} from '@blueprintjs/datetime';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css'
import moment from 'moment';
import { Margin10 } from  '../GlobalStyle/Margin';
import { countries } from '../../api/country';
import { oneCountry, historicalCountry } from '../../api/endpoints';
import { useGlobalState, useGlobalDispatch } from '../../contexts/GlobalContext'
import { changeCountryRightCorner } from '../../contexts/Actions';
import { ResponsivePieCanvas } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';


const itemRenderer = (item, {handleClick, modifiers, query}) => {
    return(
        <MenuItem 
            key={item.ISO2}
            label={item.Slug}
            text={item.Country}
            active={modifiers.active}
            onClick={handleClick}
            shouldDismissPopover={true}
        />
    )
}

const itemPredicate = (query, item, _index, exactMatch) =>{    
    const normalizeCountry = item.Country.toLowerCase();
    const normalizeSlug = item.Slug.toLowerCase();
    const normalizeISO2 = item.ISO2.toLowerCase();
    const normalizeQuery = query.toLowerCase();
    // console.log('normalizeQuery: ', normalizeQuery, 
    //         'normalizeCountry:', normalizeCountry, 
    //         'exactmatch: ', exactMatch)
    
    if(exactMatch){
        return normalizeCountry === normalizeQuery
    }
    else{
        return normalizeCountry.indexOf(normalizeQuery) >= 0
            || normalizeSlug.indexOf(normalizeQuery) >=0 
            || normalizeISO2.indexOf(normalizeQuery) >=0
    }
}

const fetchCountryStats = async (key, iso2, yesterday) =>{
    console.log('onecountry:', oneCountry, "iso2: ", oneCountry + iso2)
    return(
        (await fetch(oneCountry + iso2 + `?yesterday=${yesterday}&strict=true`)).json()
    )
}
const fetchHistoryCountry = async (key, iso2, range) => {
    return( (await (await fetch(historicalCountry + iso2 + `?lastdays=${range}`)).json()))
}
const colors = [
    [ "hsl(355, 88, 55)", "hsl(349, 94, 28)", "hsl(186, 34, 40)", "hsl(21, 88, 55)", "hsl(4, 87, 60)", "hsl(354, 89, 54)"],
    [ "hsl(174, 100, 25)", "hsl(175, 95, 37)", "hsl(46, 80, 73)", "hsl(29, 88, 55)", "hsl(10, 87, 58)", "hsl(196, 41, 38)" ], 
    [ "hsl(315, 48, 36)", "hsl(19, 91, 58)", "hsl(0, 0, 94)", "hsl(214, 37, 32)", "hsl(190, 72, 31)", "hsl(185, 60, 61)" ],
    [ "hsl(343, 94, 28)", "hsl(343, 65, 56)", "hsl(337, 53, 29)", "hsl(337, 82, 70)", "hsl(185, 71, 82)", "hsl(50, 89, 54)" ],
    [ "hsl(325, 29, 54)", "hsl(52, 95, 58)", "hsl(325, 100, 49)", "hsl(185, 94, 66)", "hsl(185, 50, 46)", "hsl(33, 87, 58)" ],
    [ "hsl(331, 96, 48)", "hsl(67, 96, 33)", "hsl(39, 96, 48)", "hsl(16, 88, 57)", "hsl(0, 85, 66)", "hsl(354, 66, 55)" ]
]
const generateDataSunburst = (data, colors = []) => {
    let coloring = colors[Math.floor(Math.random() * Math.floor(colors.length))]    
    console.log(" +++ data : ",data)
    const datastyled = [
        // {
        //     "id": "cases",
        //     "label" : "cases",
        //     "color": coloring[0],
        //     "value": data.cases
        // },
        {
            "id": "today cases",
            "label" : "today cases",
            "color": coloring[1],
            "value": data.todayCases
        },
        {
            "id": "deaths",
            "label" : "deaths",
            "color": coloring[2],
            "value": data.deaths
        },
        {
            "id": "recovered",
            "label" : "recovered",
            "color": coloring[3],
            "value": data.recovered             
        },
        {
            "id": "active",
            "label" : "active",
            "color": coloring[4],
            "value": data.active             
        },
        {
            "id": "critical",
            "label" : "critical",
            "color": coloring[5],                
            "value": data.critical,             
        }
    ]
    console.log(' ++++ styled data: ', datastyled)
    return (
        <ResponsivePieCanvas
            data={datastyled}
            margin={{top: 40, right: 200, bottom: 40, left: 80}}
            pixelRatio={1}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={10}
            fit={true}
            colors={{scheme: "category10"}}
            borderColor={{from: "color", modifiers: [["darker",2]]}}
            radialLabelsSkipAngle={10}
            radialLabelsTextXOffset={6}
            radialLabelsTextColor="#333333"
            radialLabelsLinkOffset={0}
            radialLabelsLinkDiagonalLength={16}
            radialLabelsLinkHorizontalLength={24}
            radialLabelsLinkStrokeWidth={1}
            radialLabelsLinkColor={{from: "color"}}
            slicesLabelsSkipAngle={10}
            slicesLabelsTextColor="#333333"
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            defs={[
                {
                    id: "dots",
                    type: "patternDots",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    size: 4,
                    padding: 1,
                    stagger: true,
                },
                {
                    id: "lines",
                    type: "patternLines",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10,
                },
            ]}
            fill={[
                {match: {id: "cases"}, id: "dots"},
                {match: {id: "deaths"}, id: "dots"},
                {match: {id: "recovered"}, id: "lines"},
                {match: {id: "active"}, id: "dots"},
                {match: {id: "critical"}, id: "dots"},
            ]}
            legends={[
                {
                    anchor: "right",
                    direction: "column",
                    translateX: 140,
                    itemWidth: 60,
                    itemHeight: 14,
                    itemsSpacing: 2,
                    symbolSize: 14,
                    symbolShape: "square",
                },
            ]}
        />
    );    
}

const MomemtDate = ({date}) =>{
    return(
        moment(date).isValid() ?
            <Tag intent={Intent.SUCCESS}>{moment(date).format('dddd, LL')}</Tag>
            :
            <Tag intent={Intent.NONE}>no date</Tag>
    )
}
const GenerateDataLine = ({ dataIn }) => {    
    let minDate = moment('2020-02-20');
    let maxDate = moment();
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [rangeDates, setRangeDates] = useState([minDate, maxDate])
    let range = moment(rangeDates[1]).diff(moment(rangeDates[0]), 'days');
    const {status, data, error } = useQuery(['historyCountry', dataIn.countryInfo['iso2'], range], fetchHistoryCountry)
    const handleDateRangeChange = (selectedDates) => {
        if(selectedDates[0] !== null && selectedDates[1] !== null){
            setRangeDates(selectedDates);
            setOpenDatePicker(!openDatePicker);
        }
    }
    const [styledData, setStyledData] = useState([])
    useEffect(() => {
        if(status === 'success'){
            
            setStyledData([{
                "id" : `cases`,
                "color" : "hsl(213, 70%, 50%)",
                "data": 
                    Object.keys(data.timeline['cases']).map(k => ({
                        "x" : k,
                        "y" : data.timeline['cases'][k]
                    }))                    
                
            },
            {
                "id" : `deaths`,
                "color" : "hsl(278, 70%, 50%)",
                "data": 
                    Object.keys(data.timeline['deaths']).map(k => ({
                        "x" : k,
                        "y" : data.timeline['cases'][k]
                    }))                     
                
            },
            {
                "id" : `recovered`,
                "color" : "hsl(229, 70%, 50%)",
                "data": 
                    Object.keys(data.timeline['recovered']).map(k => ({
                        "x" : k,
                        "y" : data.timeline['cases'][k]
                    }))                   
                
            }])
        }        
    }, [data])   
    return(
        <>
            <Popover 
                boundary='window'
                hasBackdrop={false}
                interactionKind={PopoverInteractionKind.CLICK_TARGET_ONLY}
                isOpen={openDatePicker}
                position='bottom-left'
                usePortal={true}
                canEscapeKeyClose={true}
                minimal={false}
                modifiers={{
                    arrow: {enabled: true},
                    flip: {enabled: true},
                    keepTogether: {enabled: true},
                    preventOverflow: {enabled: true}
                }}
                popoverClassName={Classes.POPOVER_CONTENT_SIZING}
            >
                <Button intent='primary' text='Select Dates' onClick={() => setOpenDatePicker(!openDatePicker)}/>
                {                
                    <div>
                        <DateRangePicker
                            className='date-picker'
                            minDate={minDate.toDate()}
                            maxDate={maxDate.toDate()}
                            onChange={handleDateRangeChange}
                            singleMonthOnly={true}
                            shortcuts={false}
                        />
                    </div>                
                }
            </Popover>
            <div className='range-date-resume'>
                <MomemtDate date={rangeDates[0]}/>
                <Icon icon='arrow-right'/>
                <MomemtDate date={rangeDates[1]}/>
            </div>
            { console.log('styled data :', styledData)}
            {                
                status === 'success' && <ResponsiveLine
                    data={styledData}
                    width='700'
                    height='500'
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                    axisTop={null}
                    axisRight={null}
                    enableGridY={true}                    
                    // enablePointLabel={true}
                    enableGridX={true}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 2,
                        tickPadding: 10,
                        tickRotation: -70,
                        legend: 'dates',
                        legendOffset: 50,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'count',
                        legendOffset: -45,
                        legendPosition: 'middle'
                    }}
                    colors={{ scheme: 'set1' }}
                    pointSize={2}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabel="y"
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'right',
                            direction: 'column',
                            justify: false,
                            translateX: 90,
                            translateY: 30,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                />
            }
        </>
    )
}

function Country() {
    const { countryRightCorner : {country, iso2} } = useGlobalState();
    const [modalOpenState, setModalOpenState] = useState(false)
    const [chartType, setChartTypeToLine] = useState(true);
    const [yesterday, setYesterday] = useState(false)
    const dispatch = useGlobalDispatch();    
    const { status, data, error } = useQuery(['countryStats', iso2, yesterday], fetchCountryStats)
    const handleChangeCountryClick = (item) => {
        dispatch(changeCountryRightCorner({country: item.Country, iso2: item.ISO2}))
    }
    const handleRefreshClick = () =>{
        const queries = queryCache.refetchQueries(['countryStats', iso2], {
            exact: true,
            throwOnError: true,
            force: true
        })
    }
    const handleOpenModal = () => {
        setModalOpenState(true);
        
    }
    const handleCloseModal = () => {
        setModalOpenState(false)
    }
    const handleChangeChart = () => {
        setChartTypeToLine(!chartType)
    }
    const handleChangeYesterday = () => {
        setYesterday(!yesterday);
    }
    const handleDateChange = (range) => {

    }
    return (
        <div>
            {
                console.log("state", data, "status: ", status)
            }
            <Callout title={`Stats for ${country}`} icon={'flag'} intent='Primary'>
                <p>
                    Updated covid-19 statistics for your precised Country
                    It will updated each 10 minute 
                    <br/>
                    <strong>Last Updated</strong> : { status === 'success' && new Date(data.updated).toLocaleString()}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent:'space-evenly'}}>                    
                    <Button className='graph' icon="doughnut-chart" onClick={handleOpenModal}>Genrate Graph</Button>
                    <Switch labelElement={<strong>Yesterday</strong>} inline={true} large={true} checked={yesterday} onChange={handleChangeYesterday}/>
                </div>
                <Dialog 
                    className='country-graph' 
                    icon="doughnut-chart" 
                    onClose={handleCloseModal} 
                    title={`${country} chart`}
                    autoFocus={true}
                    canEscapeKeyClose={true}
                    canOutsideClickClose={true}
                    enforceFocus={true}
                    isOpen={modalOpenState}
                    usePortal={true}
                >   
                    <div className={Classes.DIALOG_BODY}>                        
                        <p>
                            <strong>
                                Data integration is the seminal problem of the digital age. For over ten years, we’ve
                                helped the world’s premier organizations rise to the challenge.
                            </strong>
                        </p>
                        <div className='chart-line'>
                            {
                                chartType === false ?
                                    (status === 'loading' ? <Spinner size={Spinner.SIZE_LARGE}/> : generateDataSunburst(data, colors))
                                : status === 'loading' ? <Spinner size={Spinner.SIZE_LARGE}/> : <GenerateDataLine dataIn={data}/>
                            }
                        </div>
                    </div>
                    {
                        console.log('state tyep : ', chartType)
                    }
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Tooltip content='close chart dialog'>
                                <Button onClick={handleCloseModal}> Close </Button>
                            </Tooltip>
                            <Tooltip content='change between pie and line chart'>
                                <Button onClick={handleChangeChart} intent='primary'>
                                    Change to {chartType === true ? 'pie' : 'line'}
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </Dialog>      
            </Callout>
            <Margin10/>
            <Card elevation={Elevation.ONE} interactive={true}>
                <Callout title='Total Cases' intent='none' style={{marginBottom: '10px'}}>                        
                    <div className='result'>{status !== 'loading' && data.cases}</div>
                </Callout>
                <H5>
                    Today Results
                </H5>                
                <div className={status === 'loading' ? 'bp3-skeleton' : 'callout'}>
                    <Callout title='Cases' intent='warning'>                        
                        <div className='result'>{status !== 'loading' && data.todayCases}</div>
                    </Callout>
                    <Divider/>
                    <Callout title='Deaths' intent='danger'>
                        <div className='result'>{status !== 'loading' && data.todayDeaths}</div> 
                    </Callout>
                </div>              
            </Card>
            <Divider/>
            <Card elevation={Elevation.ONE} interactive={true}>
                <H5>
                    Recovered
                </H5>
                <div className={status === 'loading' ? 'bp3-skeleton' : 'callout'}>
                    <Callout title='Revovered' intent='success'>                        
                        <div className='result'>{status !== 'loading' && data.recovered}</div>                        
                    </Callout>
                    <Divider/>
                    <Callout title='Tests' icon='diagnosis' intent='none'>
                        <div className='result'>{status !== 'loading' && data.tests}</div> 
                    </Callout>
                </div>                
            </Card>
            <Divider/>
            <Card elevation={Elevation.ONE} interactive={true}>
                <H5>
                    Deaths & Criticals
                </H5>
                <div className={status === 'loading' ? 'bp3-skeleton' : 'callout'}>
                    <Callout title='Total Deaths' intent='danger'>                        
                        <div className='result'>{status !== 'loading' && data.deaths}</div>                        
                    </Callout>
                    <Divider/>
                    <Callout title='Critical case' icon='selection' intent='none'>
                        <div className='result'>{status !== 'loading' && data.critical}</div> 
                    </Callout>
                </div>                  
            </Card>
            <Divider/>
            <Card elevation={Elevation.ONE} interactive={true}>
                <H5>
                    Other Stats
                </H5>
                <div className={status === 'loading' ? 'bp3-skeleton' : 'callout'}>
                    <Callout title='cases/million' icon='percentage' intent='none'>                        
                        <div className='result'>{status !== 'loading' && data.casesPerOneMillion}</div>                        
                    </Callout>
                    <Divider/>
                    <Callout title='deaths/million' icon='percentage' intent='none'>
                        <div className='result'>{status !== 'loading' && data.deathsPerOneMillion}</div> 
                    </Callout>
                </div>                
            </Card>
            <Divider/>
            <Card interactive={true} className='card-spaced'>
                <Select 
                    items={countries}
                    filterable={true}
                    itemRenderer={itemRenderer}
                    itemPredicate={itemPredicate}
                    onItemSelect={handleChangeCountryClick}
                    noResults={<MenuItem disabled={true} text='No Results'/>}
                    resetOnQuery={true}
                    popoverProps={{
                        position: "top"
                    }}
                    // initialContent={allCountries ? <MenuItem disabled={true} text={`${allCountries.length} country loaded`}/> : undefined}
                >
                    <Button text={country ? country : 'select Country'} intent='primary' rightIcon='path-search'/>
                </Select>
                <Button icon="refresh" intent="success" onClick={handleRefreshClick}>
                    Refresh
                </Button>
            </Card>
        </div>
    )
}

export default Country
