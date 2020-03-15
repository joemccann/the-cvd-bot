const fetch = require('node-fetch')

const isCountryCode = (country) => {
  return (country && country.length && country.length === 2)
}

//
// returns an array of length 1 or n
//
module.exports = async ({ URL = '', country = '' }) => {
  const COUNTRY_URL = URL ||
  'https://api.coronatracker.com/v2/analytics/country'

  if (!country) {
    return {
      err: new Error('Please provide a country or two-letter country code.')
    }
  }
  try {
    const response = await fetch(COUNTRY_URL)
    if (!response.ok) return { err: new Error(response.statusText) }

    let data = await response.json()
    const upperCasedCountry = country.toUpperCase()
    const isCode = isCountryCode(upperCasedCountry)
    if (isCode) {
      data = data.filter(el => {
        return el.countryCode === country
      })
      return { data }
    } else if (country.toUpperCase() === 'ALL') {
      return { data }
    } else {
      data = data.filter(el => {
        return el.countryName.toUpperCase() === upperCasedCountry
      })
      if (!data.length) return { err: new Error(`No data for ${country}.`) }
      return { data }
    }
  } catch (err) {
    return { err }
  }
}
