const bot = require('./src/')

module.exports = async function (context, request) {
  context.log('Azure Function Sanity ✓')

  const { rawBody = null } = request

  let update = null

  try {
    update = JSON.parse(rawBody)
  } catch (err) {
    context.res = {
      body: err,
      status: 500
    }

    return { err }
  }

  const { err, data: body } = await bot(update)
  //
  // by default anyway but let's set for testing...
  //
  let status = 200

  if (err) {
    status = 500
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
  console.log('--------------------------')
  console.dir(req)
  console.log('--------------------------')
  console.dir(res)

  return { data: res, status: res.status }
}
