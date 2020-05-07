import styled from 'styled-components'

export const Grid = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-flow: row nowrap;
`

export const GridColumn = styled.div`
    flex: 1 1 auto;
`

export const StickyGridColumn = styled(GridColumn)`
    position: sticky;
`
export const SpacedColumn= styled(GridColumn)`
    padding: 0 15px 0px 0;
    &:not(:last-child){
        margin-right: 15px;
    }
`