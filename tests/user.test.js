const mongoose = require('mongoose')
const User = require('../models/user')
const {
  initialUsers,
  oneUser,
  oneUserNoUsername,
  oneUserNopassword,
  oneUserLength,
  oneUserPassLength,
  api,
  getAllUsers,
  usersInDb
} = require('./user_helper')

describe('when there is initially some users saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(initialUsers)
  })

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('correct amount of users', async () => {
    const { response } = await getAllUsers()
    expect(response.body).toHaveLength(initialUsers.length)
  })

  test('identifier is named id', async () => {
    const { response } = await getAllUsers()
    expect(response.body[0].id).toBeDefined()
  })
  describe('addition new users', () => {
    test('Post creates a new user, total number of users is increased by one', async () => {
      await api
        .post('/api/users')
        .send(oneUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const finalUsers = await usersInDb()
      expect(finalUsers).toHaveLength(initialUsers.length + 1)
      const { usernames } = await getAllUsers()
      expect(usernames).toContain(oneUser.username)
    }, 10000)

    test('we cant add an user if username or password is missing,status code expected: 400', async () => {
      await api
        .post('/api/users')
        .send(oneUserNoUsername)
        .expect(400)

      await api
        .post('/api/users')
        .send(oneUserNopassword)
        .expect(400)
      const finalUsers = await usersInDb()
      expect(finalUsers).toHaveLength(initialUsers.length)
    })

    test('we cant add an user if username or password are less than three characters,status code expected: 400', async () => {
      await api
        .post('/api/users')
        .send(oneUserLength)
        .expect(400)

      await api
        .post('/api/users')
        .send(oneUserPassLength)
        .expect(400)
      const finalUsers = await usersInDb()
      expect(finalUsers).toHaveLength(initialUsers.length)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
