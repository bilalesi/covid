import React, { useState, useEffect } from 'react'
import { useQuery, queryCache } from 'react-query';
import './Country.css';


import { Card, Elevation, H5, Button, Divider, Callout, MenuItem, Classes, Dialog, Tooltip, Spinner, Popover, PopoverInteractionKind, Intent, Tag, Icon, Switch } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { DateRangePicker} from '@blueprintjs/datetime';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css'
import moment from 'moment';
import 'moment/locale/ar-dz';
import { Margin10 } from  '../GlobalStyle/Margin';
import { countries } from '../../api/country';
import { oneCountry, historicalCountry } from '../../api/endpoints';
import { useGlobalState, useGlobalDispatch } from '../../contexts/GlobalContext'
import { changeCountryRightCorner } from '../../contexts/Actions';
import { ResponsivePieCanvas } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';


const itemRenderer = (item, {handleClick, modifiers}) => {
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
    const {status, data } = useQuery(['historyCountry', dataIn.countryInfo['iso2'], range], fetchHistoryCountry)
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
                "id" : `الحالات`,
                "color" : "hsl(213, 70%, 50%)",
                "data": 
                    Object.keys(data.timeline['cases']).map(k => ({
                        "x" : k,
                        "y" : data.timeline['cases'][k]
                    }))                    
                
            },
            {
                "id" : `الوفيات`,
                "color" : "hsl(278, 70%, 50%)",
                "data": 
                    Object.keys(data.timeline['deaths']).map(k => ({
                        "x" : k,
                        "y" : data.timeline['cases'][k]
                    }))                     
                
            },
            {
                "id" : `الإستشفاء`,
                "color" : "hsl(229, 70%, 50%)",
                "data": 
                    Object.keys(data.timeline['recovered']).map(k => ({
                        "x" : k,
                        "y" : data.timeline['cases'][k]
                    }))                   
                
            }])
        }        
    }, [data, status])   
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
    const { status, data } = useQuery(['countryStats', iso2, yesterday], fetchCountryStats)
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
 
    return (
        <div>          
            <Callout title={`إحصاءات  ${country}`} icon={'flag'} intent='Primary' className='bp3-rtl'>
                <p className='bp3-rtl'>
                    {/* Updated covid-19 statistics for your precised Country
                    It will updated each 10 minute  */}
                    إحصاءات الفيروس المستجد كوفيد-19 لبلد معين
                    يتم التحديث أوتوماتيكيا كل عشر  '10' دقائق
                    <br/>
                    {/* <strong>التحديث الأخير</strong> : { status === 'success' && moment(new Date(data.updated).toLocaleString())} */}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent:'space-evenly'}} className='bp3-rtl'>                    
                    <Button className='graph bp3-rtl' icon="doughnut-chart" onClick={handleOpenModal}>الرسوم البيانية</Button>
                    <Switch className='bp3-rtl' labelElement={<strong>الأمس</strong>} inline={true} large={true} checked={yesterday} onChange={handleChangeYesterday}/>
                </div>
                <Dialog 
                    className='country-graph bp3-rtl' 
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
                            <strong className='bp3-rtl'>
                                الرسوم البيانية لها دور جد فعال في تقديم صورة واضحة عن تطور هذا الفيروس 
                                يتم تقديم في هذه النافذة رسوم حطية و رسوم دائرية عن توزيع النسب و كذا التطور اليومي للفيروس
                            </strong>
                        </p>
                        <div className='chart-line bp3-rtl'>
                            {
                                chartType === false ?
                                    (status === 'loading' ? <Spinner size={Spinner.SIZE_LARGE}/> : generateDataSunburst(data, colors))
                                : status === 'loading' ? <Spinner size={Spinner.SIZE_LARGE}/> : <GenerateDataLine dataIn={data}/>
                            }
                        </div>
                    </div>                 
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Tooltip content='close chart dialog'>
                                <Button onClick={handleCloseModal}> إغلاق </Button>
                            </Tooltip>
                            <Tooltip content='change between pie and line chart'>
                                <Button onClick={handleChangeChart} intent='primary'>
                                    تغيير إلى {chartType === true ? 'بيان دائري' : 'منحنى خطي'}
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </Dialog>      
            </Callout>
            <Margin10/>
            <Card elevation={Elevation.ONE} interactive={true}>
                <Callout title='الحالات الإجمالية' intent='none' style={{marginBottom: '10px'}} className='--second bp3-rtl'>                        
                    <div className='result'>{status !== 'loading' && data.cases}</div>
                </Callout>
                <H5 className='bp3-rtl'>
                    الحالات الأنية
                </H5>                
                <div className={status === 'loading' ? 'bp3-skeleton bp3-rtl' : 'callout bp3-rtl'}>
                    <Callout title='الحالات الآنية' intent='warning' className='--second bp3-rtl'>      
                        <div className='result bp3-rtl'>{status !== 'loading' && data.todayCases}</div>
                    </Callout>
                    <Divider/>
                    <Callout title='الوفيات الآنية' intent='danger' className='--second bp3-rtl'>
                        <div className='result bp3-rtl'>{status !== 'loading' && data.todayDeaths}</div> 
                    </Callout>
                </div>              
            </Card>
            <Divider/>
            <Card elevation={Elevation.ONE} interactive={true}>
                <H5 className='bp3-rtl'>
                    حالات الإستشفاء
                </H5>
                <div className={status === 'loading' ? 'bp3-skeleton bp3-rtl' : 'callout bp3-rtl'}>
                    <Callout title='حالات الإستشفاء' intent='success' className='--second bp3-rtl'>
                        <div className='result bp3-rtl'>{status !== 'loading' && data.recovered}</div>                        
                    </Callout>
                    <Divider/>
                    <Callout title='الإختبارات' icon='diagnosis' intent='none' className='--second bp3-rtl'>
                        <div className='result bp3-rtl'>{status !== 'loading' && data.tests}</div> 
                    </Callout>
                </div>                
            </Card>
            <Divider/>
            <Card elevation={Elevation.ONE} interactive={true} className='bp3-rtl'>
                <H5 className='bp3-rtl'>
                    الوفيات & الحالات الحرجة
                </H5>
                <div className={status === 'loading' ? 'bp3-skeleton --second bp3-rtl' : 'callout --second bp3-rtl'}>
                    <Callout title='الوفيات' intent='danger'>                        
                        <div className='result bp3-rtl'>{status !== 'loading' && data.deaths}</div>                        
                    </Callout>
                    <Divider/>
                    <Callout title='الحالات الحرجة' icon='selection' intent='none' className='--second bp3-rtl'>
                        <div className='result bp3-rtl'>{status !== 'loading' && data.critical}</div> 
                    </Callout>
                </div>                  
            </Card>
            <Divider/>
            <Card elevation={Elevation.ONE} interactive={true} className='bp3-rtl'>
                <H5>
                    إحصاءات دلالية
                </H5>
                <div className={status === 'loading' ? 'bp3-skeleton bp3-rtl' : 'callout bp3-rtl'}>
                    <Callout title='الحالات/المليون' icon='percentage' intent='none' className='--second bp3-rtl'>                        
                        <div className='result bp3-rtl'>{status !== 'loading' && data.casesPerOneMillion}</div>                        
                    </Callout>
                    <Divider/>
                    <Callout title='الوفيات/المليون' icon='percentage' intent='none' className='--second bp3-rtl'>
                        <div className='result bp3-rtl'>{status !== 'loading' && data.deathsPerOneMillion}</div> 
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
                    <Button text={country ? country : 'إختر البلد'} intent='primary' rightIcon='path-search' outlined={true}/>
                </Select>
                <Button icon="refresh" intent="success" onClick={handleRefreshClick}>
                    تحديث البيانات
                </Button>
            </Card>
        </div>
    )
}

export default Country
