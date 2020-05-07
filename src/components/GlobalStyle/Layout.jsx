import styled from 'styled-components';

export const Layout = styled.div`
    max-width: 1250px;
    margin: 50px auto 0;
`

export const LayoutColumn = styled(Layout)`
    display: flex;
    flex-flow: column nowrap;    
    justify-content: space-between;
`