const fetch = require('node-fetch')

module.exports = async (URL) => {
  const STATS_URL = URL || 'https://corona.lmao.ninja/all'
  try {
    const response = await fetch(STATS_URL)

    if (!response.ok) return { err: new Error(response.statusText) }

    const data = await response.json()
    return { data }
  } catch (err) {
    return { err }
  }
}
