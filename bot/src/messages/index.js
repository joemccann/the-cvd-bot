const { news, stats } = require('../commands/')

const {
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
    await bot.sendMessage(id, `😕 Sorry our source for news is currently unavailable.`)
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
    await bot.sendMessage(id, `😕 Sorry our source for stats is currently unavailable.`)
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

module.exports = {
  helpMessage,
  newsMessage,
  startMessage,
  statsMessage
}
