const app = require('../server/server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

it('all endpoint', async done => {
    const res = await request.get('/')
    expect(res.status).toBe(200)
    done()
  })
