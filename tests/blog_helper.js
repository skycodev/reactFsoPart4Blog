const Blog = require('../models/blog')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

const initialBlogs = [
  {
    title: 'blog uno',
    author: 'anibaltorices',
    url: 'https://www.anibaltorices.com',
    likes: 89,
    id: '635f9209d8af9f9ecc0fdca7'
  },
  {
    title: 'blog dos',
    author: 'anibaltorices',
    url: 'https://www.anibaltorices.com',
    likes: 15,
    id: '635f9217d8af9f9ecc0fdca9'
  },
  {
    title: 'blog tres',
    author: 'anibaltorices',
    url: 'https://www.anibaltorices.com',
    likes: 18,
    id: '635f9225d8af9f9ecc0fdcac'
  }
]

const oneBlog = {
  title: 'only one blog',
  author: 'anibaltorices',
  url: 'https://www.anibaltorices.com',
  likes: 18,
  id: '635f525d8af9f9ecc0fdcac'
}

const oneBlogNoLikes = {
  title: 'blog no likes',
  author: 'anibaltorices',
  url: 'https://www.anibaltorices.com',
  id: '635f929ecc0fdcac56455556456'
}
const oneBlogNoTitle = {
  author: 'anibaltorices',
  url: 'https://www.anibaltorices.com',
  likes: 18,
  id: '635f929ecc0fdca3454456456'
}
const oneBlogNoUrl = {
  title: 'blog no url',
  author: 'anibaltorices',
  likes: 20,
  id: '635f929ecc034526456456'
}
const newBlogUpdated = {
  title: 'blog uno',
  author: 'anibaltorices',
  url: 'https://www.anibaltorices.com',
  likes: 100
}
const emptyBlog = {}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}
const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'willremovethissoon',
    url: 'testurl.com',
    likes: 0
  })
  await blog.save()
  await blog.remove()
  return blog._id.toString()
}

const getAllBlogs = async () => {
  const response = await api.get('/api/blogs')
  return {
    titles: response.body.map(blog => blog.title),
    response
  }
}
module.exports = {
  initialBlogs,
  oneBlog,
  emptyBlog,
  oneBlogNoLikes,
  oneBlogNoTitle,
  oneBlogNoUrl,
  newBlogUpdated,
  blogsInDb,
  nonExistingId,
  api,
  getAllBlogs
}
