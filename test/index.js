const test = require('tape')

const { country, news, stats } = require('../bot/src/commands')

test('sanity', t => {
  t.ok(true)
  t.end()
})

test('fail country - network failure', async t => {
  const { err, data } = await country({
    URL: 'https://foo.bar.fail.com',
    country: 'IT'
  })

  t.ok(!data)
  t.ok(err)
  t.equals(err.message, 'request to https://foo.bar.fail.com/ failed, ' +
  'reason: getaddrinfo ENOTFOUND foo.bar.fail.com')
  t.end()
})

test('fail country - absent parameter', async t => {
  const { err, data } = await country({})

  t.ok(!data)
  t.ok(err)
  t.equals(err.message, 'Please provide a country or two-letter country code.')
  t.end()
})

test('pass country by name', async t => {
  const { err, data } = await country({ country: 'Italy' })

  t.ok(data)
  t.ok(!err)

  const { countryCode, lat, lng } = data[0]

  t.equals(lat, 41.87194)
  t.equals(lng, 12.56738)
  t.equals(countryCode, 'IT')

  t.end()
})

test('pass country by code', async t => {
  const { err, data } = await country({ country: 'IT' })

  t.ok(data)
  t.ok(!err)
  const { countryName, lat, lng } = data[0]

  t.equals(lat, 41.87194)
  t.equals(lng, 12.56738)
  t.equals(countryName, 'Italy')

  t.end()
})

test('pass all countries', async t => {
  const { err, data } = await country({ country: 'ALL' })

  t.ok(data)
  t.ok(!err)
  t.true(Array.isArray(data))
  t.true(data.length)

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
