const bot = require('./src/')

module.exports = async function (context, request) {
  //
  // tgfancy doens't bubble errors property so we have to wrap in try/catch
  //
  try {
    context.log('Azure Function Sanity ✓')

    const { rawBody = null } = request

    let update = null

    //
    // By default anyway and we must leave it as Telegram will retry forever.
    //
    const status = 200

    try {
      update = JSON.parse(rawBody)
    } catch (err) {
      context.res = {
        body: err,
        status
      }

      return { err }
    }

    const { err, data: body } = await bot(update)

    if (err) {
      context.res = {
        body: err.message,
        status
      }
    }

    context.res = {
      body,
      status
    }

    const { req, res } = context

    return { data: res, status: res.status, req }
  } catch (err) {
    context.res = {
      body: err.message,
      status: 200
    }
    return { err: err.message }
  }
}
