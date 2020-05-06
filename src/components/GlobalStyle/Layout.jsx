import styled from 'styled-components';

export const Layout = styled.div`
    max-width: 950px;
    margin: 0 auto;
`

export const LayoutColumn = styled(Layout)`
    display: flex;
    flex-flow: column nowrap;    
    justify-content: space-between;
`