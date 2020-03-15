const TOKEN = process.env.TELEGRAM_BOT_TOKEN
const wh = (process.env.PRODUCTION)
  ? process.env.WEBHOOK_ADDRESS
  : process.env.WEBHOOK_ADDRESS_LOCAL

const Bot = require('tgfancy')

const bot = new Bot(TOKEN, {
  polling: false,
  emojification: true
})

bot.setWebHook(wh)

const {
  oneLine
} = require('common-tags')

const {
  ChatActions,
  Errors
} = require('./copy')

const {
  countryMessage,
  helpMessage,
  newsMessage,
  statsMessage,
  startMessage
} = require('./messages')

const COMMANDS = {
  c: countryMessage,
  country: countryMessage,
  help: helpMessage,
  n: newsMessage,
  news: newsMessage,
  start: startMessage,
  s: statsMessage,
  stats: statsMessage
}

module.exports = async (data) => {
  const { message = {} } = data
  const { text = '', chat = {} } = message
  const { id = '' } = chat

  //
  // Bail early if there is no Chat ID.
  //
  if (!id) {
    await bot.sendMessage(id, Errors.missingChatId)
    return { err: new Error(Errors.missingChatId) }
  }
  //
  // Check for additional input after slash command
  //
  try {
    const inputs = text && text.split(' ')
    const input = inputs ? inputs[1] : null

    // Validate message whether text is a command.
    if (text.indexOf('/') !== 0) {
      await bot.sendMessage(id, Errors.unrecognizedCommand)
      return { err: new Error(Errors.unrecognizedCommand) }
    }

    //
    // Only interpret the text after the preceeding slash
    // and to the first blank space as command
    //
    const command = (text.indexOf(' ') === -1)
      ? text.substring(1, text.length)
      : text.substring(1, text.indexOf(' '))

    const exec = COMMANDS[command]

    //
    // Check whether the command exists, i.e. we have a mapping for it
    //
    if (!exec) {
      await bot.sendMessage(id, Errors.unrecognizedCommand)
      return { err: new Error(Errors.unrecognizedCommand) }
    }

    //
    // Send "Typing..." command
    //
    await bot.sendChatAction(id, ChatActions.typing)

    //
    // Run the corresponding function
    //
    await exec(bot, id, input, inputs)
  } catch (err) {
    bot.sendMessage(id, oneLine`
    CVD-19 bot encountered a bizarre error: ${err.message}
    Contact @linestepper with your issue.
    `)
    return { err }
  }
  return { data }
}
