import React from 'react'
import { useQuery } from 'react-query'
import './Global.css';
import { worldStats } from '../../api/endpoints'
import {Card, Callout, Divider, Spinner, H2} from '@blueprintjs/core';

const fetchWorldStats = async () => {
    return (await fetch(worldStats)).json()
}
const  Global = () => {
    const { status, data } = useQuery(['worldStats'], fetchWorldStats);
    return (
        <div className='global bp3-rtl'>
            <H2 className='title-1 bp3-rtl'>الإحصائيات في العالم </H2>
            <div className='content bp3-rtl'>
                <Card className='card recovered bp3-rtl'>
                    {
                        status === 'loading' ? <Spinner size={Spinner.SIZE_SMALL} intent='success'/> :
                        <>
                            <Callout title='حالات الإستشفاء' intent='none'>
                                <div className='stats'>{data.recovered}</div>    
                            </Callout>
                                                                                                                                                                        
                        </>                    
                    } 
                </Card>
                <Divider/>
                <Card className='card deaths bp3-rtl'>
                    {
                        status === 'loading' ? <Spinner size={Spinner.SIZE_SMALL} intent='danger'/> :
                        <>
                            <Callout title='الوفيات الأنية' intent='none'>
                                <div className='stats'>{data.todayDeaths}</div>    
                            </Callout>
                            <Divider/>
                            <Callout title='إجمالي الوفيات' intent='none'>
                                <div className='stats'>{data.deaths}</div>    
                            </Callout>                                                
                        </>                    
                    }                
                </Card>
                <Divider/>
                <Card className='card cases bp3-rtl'>
                    {
                        status === 'loading' ? <Spinner size={Spinner.SIZE_SMALL} intent='warning'/> :
                        <>
                            <Callout title='الحالات الأنية' intent='none'>
                                <div className='stats'>{data.todayCases}</div>    
                            </Callout>
                            <Divider/>
                            <Callout title='الحالات الإجمالية' intent='none'>
                                <div className='stats'>{data.cases}</div>    
                            </Callout>  
                            <Divider/>  
                            <Callout title='الحالات المحققة' intent='none'>
                                <div className='stats'>{data.active}</div>    
                            </Callout>  
                            <Divider/>
                            <Callout title='الحالات الحرجة' intent='none'>
                                <div className='stats'>{data.critical}</div>    
                            </Callout>                                              
                        </>                    
                    }                
                </Card>
                {/* <Divider/>
                <Card className='active-ciritical'>

                </Card>
                <Divider/> */}
            </div>
        </div>
    )
}

export default Global
