const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  if (!body || !body.title || !body.url || body === undefined) {
    return response.status(400).json({
      error: 'blog.title or body.url is missing'
    })
  }
  let newBlog = {}
  body.likes
    ? newBlog = { ...body }
    : newBlog = { ...body, likes: 0 }

  const blog = new Blog(newBlog)
  try {
    const savedBlog = await blog.save()
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
