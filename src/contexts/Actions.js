const CHANGE_COUNTRY_RIGHT_CORNER = 'CHANGE_COUNTRY_RIGHT_CORNER';

const  changeCountryRightCorner = (country) => {
    return {
        type: CHANGE_COUNTRY_RIGHT_CORNER,
        payload: country
    }
}


export {
    changeCountryRightCorner
}