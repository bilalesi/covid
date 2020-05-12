export const CHANGE_COUNTRY_RIGHT_CORNER = 'CHANGE_COUNTRY_RIGHT_CORNER';
export const DISPLAY_ALL_IN_TABLE = 'DISPLAY_ALL_IN_TABLE';

const changeCountryRightCorner = (country) => {
    return {
        type: CHANGE_COUNTRY_RIGHT_CORNER,
        payload: country
    }
}
const changeDisplayInTable = (how) => {
    return {
        type: DISPLAY_ALL_IN_TABLE,
        payload: how
    }
}


export {
    changeCountryRightCorner,
    changeDisplayInTable
}