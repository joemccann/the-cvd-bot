const { stripIndent } = require('common-tags')

const pkg = require('../../../package.json')

const HelpList = {
  message1: stripIndent`
  Welcome to *The Coronavirus-19 Bot*, CVD for short.
  
  CVD has a handful of *"slash commands"*.

  A slash command is a phrase you give to CVD by typing forward slash, "/", then the name of the command.
  
  For example, to get the latest statistics, simply type:

  \`/stats\` 

  Version: *${pkg.version}-Beta.*

  This bot is open source software written by @linestepper.

  Source code available [here](https://github.com/joemccann/the-cvd-bot).`,
  message2: stripIndent`Type \`/help\` for a full list of commands.`
}

const Commands = {
  list: stripIndent`
  /help - Show the list of available commands.
  /news - Get the latest news on Coronavirus.
  /stats - Shows the latest global statics for CVD-19.
  `
}

const Errors = {
  unrecognizedCommand: stripIndent`Hmm, that's not a recognized command. ` +
  'Please try again.'
}

const ChatActions = {
  typing: 'Typing'
}

module.exports = {
  ChatActions,
  Commands,
  HelpList,
  Errors
}
