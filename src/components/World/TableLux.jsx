import React, { useRef, useCallback, useEffect } from 'react'
import { useTable, usePagination, useSortBy } from 'react-table';
import ReactToPrint from 'react-to-print';
import { Callout, Button, Intent } from '@blueprintjs/core';
import { Margin10 } from '../GlobalStyle/Margin';
import { useGlobalState } from '../../contexts/GlobalContext'
import './style.css'






function TableLux({columns, data, refParent}) {
    const stateContext = useGlobalState();
    const pageSizing =  stateContext.displayAllInTable ?  data.length : 25;
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, 
        page, pageCount, pageOptions, canPreviousPage, canNextPage, gotoPage, previousPage, nextPage,
        setPageSize, state: { pageIndex, pageSize }
        } = useTable({columns, data, initialState: { pageIndex:0, pageSize: pageSizing, hiddenColumns: ['map', 'continent', 'iso2']}, manualPageiniation: true},
        useSortBy, usePagination);

    // useCallback(() => {
    //     if(stateContext.displayAllInTable)
    //         setPageSize(data.length)
    //     else
    //         setPageSize(25)
    // }, [stateContext.displayAllInTable])
    useEffect(() => {
        if(stateContext.displayAllInTable)
            setPageSize(data.length)
        else
            setPageSize(25)
        
    }, [stateContext.displayAllInTable])
    const copRef = useRef();
    return (
        <div>
            {
                console.log('state 89++9 :', stateContext)
            }
            <ReactToPrint
                trigger={() => <Button intent={Intent.PRIMARY}>Print</Button>}
                content={() => copRef.current}
                bodyClass='print-area'
            />
            <Margin10/>
            <table {...getTableProps()} ref={copRef}>
                <thead>
                    {
                        headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {
                                    headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())} className={column.isSorted ? column.isSortedDesc ? 'sort-desc': 'sort-asc' : null}>{column.render('Header')}</th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        page.map(row => {
                            prepareRow(row)
                            return(
                                <tr {...row.getRowProps()}>
                                    {
                                        row.cells.map(cell => {                                       
                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                    <tr></tr>
                    {/* {
                        rows.map(row => {
                            prepareRow(row)
                            return(
                                <tr {...row.getRowProps()}>
                                    {
                                        row.cells.map(cell => {                                       
                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        })
                                    }
                                </tr>
                            )
                        })
                    } */}
                </tbody>
            </table>
            <Margin10/>
            <div>
                {
                    !stateContext.displayAllInTable && <Callout intent={Intent.NONE} className='st-wrapper'>
                        <div className='controls-btns'>                        
                            <Button icon='arrow-left' disabled={!canPreviousPage} className='button-lux' onClick={() => previousPage()}/>
                            <Button icon='arrow-right' disabled={!canNextPage} className='button-lux' onClick={() => nextPage()}/>
                        </div>
                        {/* <div className='result-res'>
                            Displaying {(pageSize * pageIndex+1)} of {data.length}
                        </div> */}
                    </Callout>
                }
            </div>
            
        </div>
    )
}

export default TableLux;
