const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const authorization = request.get('Authorization')

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const token = authorization.substring(7)

  const decoddToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decoddToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const { id: userId } = decoddToken

  const user = await User.findById(userId)

  if (!body || !body.title || !body.url || body === undefined) {
    return response.status(400).json({
      error: 'blog.title or body.url is missing'
    })
  }
  let newBlog = {}
  body.likes
    ? newBlog = { ...body, user: userId }
    : newBlog = { ...body, user: userId, likes: 0 }

  const blog = new Blog(newBlog)
  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (e) { next(e) }
})

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  const blog = await Blog.findById(id)
  if (!blog) response.status(400).end()

  await Blog.findByIdAndRemove(id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const { id } = request.params
  const newBlog = { ...body }

  const blogToUpdate = await Blog.findById(id)
  if (!blogToUpdate) response.status(400).end()

  const updatedBlog = await Blog.findByIdAndUpdate(id, newBlog, { new: true })
  response.status(201).json(updatedBlog)
})

module.exports = blogsRouter
