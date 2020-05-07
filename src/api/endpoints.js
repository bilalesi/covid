// export const defaultAPI = 'https://api.covid19api.com/';
// export const countriesEndPoint = 'https://api.covid19api.com/countries';
export const defaultAPI = 'https://disease.sh/v2';
export const countriesEndPoint = 'https://api.covid19api.com/countries';

/*  Get Global Totals for Actual and Yesterday Data
    Refresh each 10 minutes
    if for yesterday : ?yesterday=true
*/

export const worldStats = 'https://disease.sh/v2/all'; 

/*  Get All Continents Totals for Actual and Yesterday Data 
    if for yesterday : ?yesterday=true
*/
// base continent 
export const baseContinentStats = 'https://disease.sh/v2/continents/';
export const allContinentsStats = 'https://disease.sh/v2/continents?yesterday=false'; 

/*  Get specific Continent Totals for Actual and Yesterday Data 
    if for yesterday : &yesterday=true
*/
export const oneContinentStats = 'https://disease.sh/v2/continents/africa?strict=true';

/*  Get All Countries Totals for Actual and Yesterday Data
    Returns a JSON array with an element for each country that has stats available. 
    This includes iso codes, lat/long, a link to the country flag, cases, new cases, deaths, new deaths, recovered, active cases, 
    critical cases, and cases/deaths per one million people. Data is updated every 10 minutes
    
    &sort=cases
 */

export const baseCountriesStats = 'https://disease.sh/v2/countries';
export const allCountries = 'https://disease.sh/v2/countries?yesterday=false';

/* Get a Specific Country's Totals for Actual and Yesterday Data
 * Get the same data from the /countries endpoint, but filter down to a specific country.
 * /{country}?yesterday=false&strict=true
 */
export const oneCountry = 'https://disease.sh/v2/countries/'

/* Get a Specific Country's Totals for Actual and Yesterday Data
 * Get the same data from the /countries endpoint, but filter down to multiple specific countries. Data is updated every 10 minutes
 * /{country1, country2, ....} ?yesterday=false
 */
export const multipleCountry = 'https://disease.sh/v2/countries/dz,us'
/*  /v2/historical/{query}
 *  Get a country's time series using a country iso code, country ID, or of course, country name. Data is updated every 10 minutes 
 * ?lastdays=120
 */
export const historicalCountry = 'https://disease.sh/v2/historical/'