const { country, news, stats } = require('../commands/')
const countryFlagEmoji = require('country-flag-emoji')
const {
  oneLine,
  stripIndent
} = require('common-tags')

const {
  Commands,
  HelpList
} = require('../copy')

async function startMessage (bot, id) {
  await bot.sendMessage(id, HelpList.message1, {
    parse_mode: 'Markdown'
  })
  await bot.sendMessage(id, HelpList.message2, {
    parse_mode: 'Markdown'
  })
}

async function helpMessage (bot, id) {
  await bot.sendMessage(id, Commands.list)
}

async function newsMessage (bot, id) {
  const { err, data: { articles = [] } } = await news()

  if (err) {
    console.error(err)
    await bot.sendMessage(id, err.message)
    return
  }

  if (!articles.length) {
    await bot.sendMessage(id, '😕 Sorry our source for news is currently unavailable.')
    return
  }

  const links = []

  articles.slice(0, 5).forEach(async (article) => {
    const {
      title,
      url
    } = article
    const msg = `[${title}](${url})`
    links.push(msg)

    await bot.sendMessage(id, msg, {
      parse_mode: 'Markdown'
    })
  })
}

async function statsMessage (bot, id) {
  const { err, data: { cases = 0, deaths = 0, recovered = 0 } } = await stats()

  if (!cases || !deaths || !recovered) {
    console.error(err.message)
    console.error(err.stack)
    await bot.sendMessage(id, err.message)
    return
  }

  if (!cases || !deaths || !recovered) {
    await bot.sendMessage(id, '😕 Sorry our source for stats is currently unavailable.')
    return
  }

  let cfr = 0

  try {
    cfr = ((deaths / cases) * 100).toFixed(2) + '%'
  } catch (err) {
    cfr = '0.0%'
    console.error(err.message)
  }

  const message = stripIndent`
  🦠 Total Number of Cases: *${(cases).toLocaleString('en')}* 

  💀 Total Number of Deaths: *${(deaths).toLocaleString('en')}* 

  🤞🏼 Total Number of Recoveries: *${(recovered).toLocaleString('en')}* 

  ⚰️  Case Fatality Rate: *${(cfr).toLocaleString('en')}* 
  `

  await bot.sendMessage(id, message, {
    parse_mode: 'Markdown'
  })
}

async function countryMessage (bot, id, input, inputs) {
  //
  // In the case the country is more than one word aka "South Africa"
  //
  try {
    if (Array.isArray(inputs) && inputs.length) {
      inputs.shift()
      input = inputs.join(' ')
    }
  } catch (err) {
    console.error(err.message)
    console.error(err.stack)
    await bot.sendMessage(id, oneLine`😕 Sorry there was an error while
    trying to get the country's data: ${err.message}`)
    return
  }
  const { err, data } = await country({ country: input })
  if (err) {
    console.error(err.message)
    console.error(err.stack)
    await bot.sendMessage(id, oneLine`😕 Sorry there was an error while
    trying to get country data: ${err.message}`)
    return
  }

  if (input.toUpperCase() === 'ALL') {
    await bot.sendMessage(id, oneLine`To get stats 
    for all countries combined just use the /stats command.`)
    await bot.sendMessage(id, oneLine`We will provide a country report soon.`)
    return
  }

  if (Array.isArray(data) && !data.length) {
    await bot.sendMessage(id, oneLine`😕 
      Sorry the country ${input} returned no data.`)
    await bot.sendMessage(id, oneLine`✍🏽 Try typing the [ISO country code](https://www.nationsonline.org/oneworld/country_code_list.htm) 
      instead of what you previously typed.`, {
      parse_mode: 'Markdown'
    })
    return { err: new Error(`No data for ${input}.`) }
  }

  let cfr = 0

  try {
    const {
      countryCode = '',
      countryName = '',
      dateAsOf = (new Date()).toDateString(),
      confirmed = 0,
      deaths = 0,
      recovered = 0
    } = data[0]

    if (!countryCode || !countryName) {
      await bot.sendMessage(id, oneLine`😕 
      Sorry the country ${input} was not available in our sources.`)
      await bot.sendMessage(id, oneLine`✍🏽 Try typing the [ISO country code](https://www.nationsonline.org/oneworld/country_code_list.htm) 
      instead of what you previously typed.`, {
        parse_mode: 'Markdown'
      })
      return { err: new Error(`Country ${input} not found.`) }
    }

    cfr = ((deaths / confirmed) * 100).toFixed(2) + '%'
    const date = new Date(dateAsOf)

    const message = stripIndent`

  Stats for ${countryName} ${(countryFlagEmoji.get(countryCode)).emoji}

  🦠 Total Number of Cases: *${(confirmed).toLocaleString('en')}* 

  💀 Total Number of Deaths: *${(deaths).toLocaleString('en')}* 

  🤞🏼 Total Number of Recoveries: *${(recovered).toLocaleString('en')}* 

  ⚰️  Case Fatality Rate: *${(cfr).toLocaleString('en')}* 

  📅 Last Update: *${date.toTimeString()}*
  `

    await bot.sendMessage(id, message, {
      parse_mode: 'Markdown'
    })
  } catch (err) {
    console.error(err.message)
    console.error(err.stack)
    await bot.sendMessage(id, oneLine`😕 Sorry there was an error while
    trying to get send your message for the country's data: ${err.message}`)

    return { err }
  }
}

module.exports = {
  countryMessage,
  helpMessage,
  newsMessage,
  startMessage,
  statsMessage
}
