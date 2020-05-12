import React, { useState, useMemo } from 'react'
import { Card, Tooltip, Collapse, H2, Callout, Switch, HTMLSelect, Spinner, Tag, Intent} from '@blueprintjs/core';
import { Margin10 } from '../GlobalStyle/Margin';
import { useQuery } from 'react-query';
import { baseCountriesStats } from '../../api/endpoints';
import TableFloaded from './TableLux';
import { useGlobalDispatch, useGlobalState } from '../../contexts/GlobalContext';
import { changeDisplayInTable } from '../../contexts/Actions'

const fetchAllCountries = async (key, typeSort, yesterday) => {
    return (await fetch(baseCountriesStats + `?yesterday=${yesterday}&sort=${typeSort}`)).json()
}
function transformFetchedData(data) {
    const transformedData = data.reduce((acc, current) => {
        acc.push({
            "flag": current.countryInfo.flag,
            "name": current.country,
            "map": [current.countryInfo.lat, current.countryInfo.long],
            "instantCases": current.todayCases,
            "instantDeaths": current.todayDeaths,
            "cases": current.cases,
            "deaths": current.deaths,
            "recovered": current.recovered,
            "active": current.active,
            "critical": current.critical,
            "tests": current.tests,
            "continent": current.continent,
            "iso2": current.countryInfo.iso2
        });
        return acc;
    }, []);
    return transformedData;
}

const options = [
    { label: 'All', value :'all'},
    { label: 'Africa', value :'africa'},
    { label: 'Asia', value :'asia'},
    { label: 'Europe', value :'europe'},
    { label: 'North America', value :'northAmerica'},
    { label: 'South America', value :'southAmerica'}
]
const Flag = ({value}) => {
    return <img src={value} alt='' style={{
        width:'25px',
        height:'18px',
        borderRadius:'8px',
        boxShadow: 'transparent 0px 0px 0px 1px, transparent 0px 0px 0px 4px, rgba(0, 0, 0, 0.12) 0px 6px 16px'
    }}/>
}
const Danger = ({value}) => {
    return value > 0 ? <Tag intent={Intent.DANGER}>{value}</Tag> : value
}
const DangerLevel = ({value}) => {
    if(value <= 99)
        return value
    else if(value > 100 && value <=500){
        return <Tag className='yellow-intent'>{value}</Tag>
    }
    else if( value >=501 && value <=2000)
        return <Tag intent={Intent.WARNING}>{value}</Tag>
    else if( value >= 2001)
        return <Tag intent={Intent.DANGER}>{value}</Tag>
}



const Table = () => {
    const [showTable, setShowTable] = useState(true)
    const handleShowTable = () => {
        setShowTable(!showTable);
    }
    const [yesterday, setYesterday] = useState(false);
    const handleChangeYesterday = () => {
        setYesterday(!yesterday)
    }
    const handleChangeDisplayAll = () => {
        // setDiplayAll(!displayAll)
        dispatch(changeDisplayInTable());
    }
    const [typeSort, setTypeSort] = useState('all')
    const handleTypeChange = (e) => {
        setTypeSort(e.currentTarget.value);
    }
    // const hiddenColumns = ['continent', '_id', 'iso2', "iso3", 'lat', 'long']
    const columns = useMemo(() => [
        {
            // Header: 'Country',
            Header: 'معلومات البلد',
            columns : [
                {
                    Header: 'الراية',
                    // Header: 'Flag',
                    accessor: 'flag',
                    Cell: ({ cell: {value}}) => <Flag value={value}/>
                },
                {
                    Header: 'إسم البلد',
                    // Header: 'Name',
                    accessor: 'name'
                },
                {
                    Header: 'Map',
                    accessor: 'map'
                }
            ]
        },
        {
            // Header: 'Instant Stats',
            Header:'الإحصاءات الأنية',
            columns : [
                {
                    Header: 'عدد الحالات اللحظية',
                    // Header: 'Cases',
                    accessor: 'instantCases'
                },
                {
                    Header: 'عدد الوفيات اللحظية',
                    // Header: 'Deaths',
                    accessor: 'instantDeaths',
                    Cell: ({cell: {value}}) => <Danger value={value}/>
                }
            ]
        },
        {
            // Header: 'Total Stats',
            Header: 'الإحصاءات الكلية',
            columns : [
                {
                    Header: 'الحالات الإجمالية',
                    // Header: 'Cases',
                    accessor: 'cases'
                },
                {
                    Header: 'الوفبات الإجمالية',
                    // Header: 'Deaths',
                    accessor: 'deaths',
                    Cell: ({cell: {value}}) => <DangerLevel value={value}/>
                },
                {
                    Header: 'حالات الإستعفاء الإجمالية',
                    // Header: 'Recovered',
                    accessor: 'recovered'
                }
            ]
        },
        {
            // Header: 'Other Stats',
            Header: 'إحصاءات إستدلالية',
            columns : [
                {
                    Header: 'عدد الحالات المحققة',
                    // Header: 'Active',
                    accessor: 'active'
                },
                {
                    Header: 'الحالات الخطيرة',
                    // Header: 'Critical',
                    accessor: 'critical'
                },
                {
                    Header: 'عدد التحاليل',
                    // Header: 'Tests',
                    accessor: 'tests'
                }
            ]
        },
        {
            Header: 'manip-columns',
            accessor: 'manipColumns',
            columns:[
                {
                    Header: 'continent',
                    accessor: 'continent'
                },
                {
                    Header: 'iso2',
                    accessor: 'iso2'
                }
            ]
        }
    ], []);
    const { status, data } = useQuery(['allCountriesData', typeSort, yesterday], fetchAllCountries);
    const rowsData = useMemo(
        () => status === 'success' ? transformFetchedData(data) : [],
        [status, data]
    )
    const dispatch = useGlobalDispatch();
    const stateContext = useGlobalState();
    return (
        <div className='bp3-rtl'>
            {console.log('table rows : ', rowsData)}
            <Tooltip content='click to collapse' className='bp3-rtl'>
                <H2 onClick={handleShowTable}>جدول الإحصاءات للعالم</H2>  
            </Tooltip>
            <Margin10/>            
            <Collapse isOpen={showTable}>
                <Callout intent='none' className='options bp3-rtl'>
                    <HTMLSelect options={options} onChange={handleTypeChange} disabled={true}/>
                    <Switch className='bp3-rtl' labelElement={<strong>الأمس</strong>} inline={true} large={true} checked={yesterday} onChange={handleChangeYesterday}/>
                    <Switch className='bp3-rtl' labelElement={<strong>إظهار الكل</strong>} inline={true} large={true} checked={stateContext.displayAllInTable} onChange={handleChangeDisplayAll}/>                    
                </Callout>
                <Margin10/>
                <Card interactive={true}>                    
                    {
                        status === 'loading' ? 
                            <Spinner size={Spinner.SIZE_LARGE}/>
                            :
                            <TableFloaded columns={columns} data={rowsData}/>
                    }
                </Card>
            </Collapse>
        </div>
    )
}

export default Table

