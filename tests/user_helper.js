const User = require('../models/user')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

const initialUsers = [
  {
    name: 'anibal',
    username: 'skycodev',
    password: 'pass1'
  },
  {
    name: 'anibal 2 ',
    username: 'skycodev2 ',
    password: 'pass2'
  },
  {
    name: 'anibal 3',
    username: 'skycodev3',
    password: 'pass3'
  }
]

const oneUser = {
  name: 'one user',
  username: 'oneuser',
  password: 'passOne'
}
const oneUserNopassword = {
  name: 'one user no password',
  username: 'oneuserNopassword'
}
const oneUserNoUsername = {
  name: 'one user no user name',
  password: 'passOneNousername'
}

const oneUserLength = {
  name: 'one user no user name',
  username: 'on',
  password: 'passOneNousername'
}
const oneUserPassLength = {
  name: 'one user no user name',
  username: 'oneuser',
  password: 'pa'
}

const getAllUsers = async () => {
  const response = await api.get('/api/users')
  return {
    usernames: response.body.map(user => user.username),
    response
  }
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialUsers,
  oneUser,
  api,
  getAllUsers,
  usersInDb,
  oneUserNoUsername,
  oneUserNopassword,
  oneUserLength,
  oneUserPassLength

}
