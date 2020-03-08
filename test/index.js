const test = require('tape')

const { news, stats } = require('../bot/src/commands')

test('sanity', t => {
  t.ok(true)
  t.end()
})

test('fail news', async t => {
  const { err, data } = await news('https://foo.bar.fail.com')

  t.ok(!data)
  t.ok(err)
  t.equals(err.message, 'request to https://foo.bar.fail.com/ failed, ' +
  'reason: getaddrinfo ENOTFOUND foo.bar.fail.com')
  t.end()
})

test('pass news', async t => {
  const { err, data } = await news()

  t.ok(data)
  t.ok(!err)

  const { articles } = data

  t.ok(articles)

  t.end()
})

test('fail stats', async t => {
  const { err, data } = await stats('https://foo.bar.fail.com')

  t.ok(!data)
  t.ok(err)
  t.equals(err.message, 'request to https://foo.bar.fail.com/ failed, ' +
  'reason: getaddrinfo ENOTFOUND foo.bar.fail.com')
  t.end()
})

test('pass stats', async t => {
  const { err, data } = await stats()

  t.ok(data)
  t.ok(!err)

  const { cases, deaths, recovered } = data

  t.ok(cases)
  t.ok(deaths)
  t.ok(recovered)

  t.end()
})

// Local bot testing mocks

// TODO: PASS MOCK API KEY AND URL
/*
test('local bot', async t => {
  const bot = require('../bot/')
  //
  // Create a mock request method and context object
  //
  function log (msg) {
    return console.log(msg)
  }

  function req (obj) {
    const body = { ...this, ...obj }
    return body
  }

  function set (value) {
    this[value] = value
    return this
  }

  const context = {
    log,
    req,
    set
  }

  t.end()
})
*/
