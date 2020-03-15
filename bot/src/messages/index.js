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

  const message = stripIndent`
  🦠 Total Number of Cases: *${(cases).toLocaleString('en')}* 

  💀 Total Number of Deaths: *${(deaths).toLocaleString('en')}* 

  🤞🏼 Total Number of Recoveries: *${(recovered).toLocaleString('en')}* 
  `

  await bot.sendMessage(id, message, {
    parse_mode: 'Markdown'
  })
}

async function countryMessage (bot, id, input) {
  const { err, data } = await country({ country: input })
  if (err) {
    console.error(err.message)
    console.error(err.stack)
    await bot.sendMessage(id, oneLine`😕 Sorry there was an error while
    trying to get country data: ${err.message}`)
    return
  }

  if (input.toUpperCase() === 'ALL') {
    //
    await bot.sendMessage(id, oneLine`To get stats 
    for all countries combined just use the /stats command.`)
    await bot.sendMessage(id, oneLine`We will provide a country report soon.`)
    return
  }

  try {
    const {
      countryCode,
      countryName,
      dateAsOf,
      confirmed,
      deaths,
      recovered
    } = data[0]

    const date = new Date(dateAsOf)

    const message = stripIndent`

  Stats for ${countryName} ${(countryFlagEmoji.get(countryCode)).emoji}

  🦠 Total Number of Cases: *${(confirmed).toLocaleString('en')}* 

  💀 Total Number of Deaths: *${(deaths).toLocaleString('en')}* 

  🤞🏼 Total Number of Recoveries: *${(recovered).toLocaleString('en')}* 

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
