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
  helpMessage,
  newsMessage,
  statsMessage,
  startMessage
} = require('./messages')

const COMMANDS = {
  help: helpMessage,
  news: newsMessage,
  stats: statsMessage,
  start: startMessage
}

module.exports = async (data) => {
  const { message } = data
  const { text, chat } = message
  const { id } = chat
  //
  // Check for additional input after slash command
  //
  const inputs = text.split(' ')
  const input = inputs ? inputs[1] : null

  try {
    // Validate message whether text is a command.
    if (text.indexOf('/') !== 0) {
      await bot.sendMessage(id, Errors.unrecognizedCommand)
      return { err: Errors.unrecognizedCommand }
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
      return { err: Errors.unrecognizedCommand }
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
    `)
    return { err }
  }
  return { data }
}
