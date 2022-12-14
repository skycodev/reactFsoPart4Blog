
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const {
  initialBlogs,
  oneBlog,
  blogsInDb,
  oneBlogNoLikes,
  oneBlogNoTitle,
  oneBlogNoUrl,
  api,
  newBlogUpdated,
  getAllBlogs,
  nonExistingId
} = require('./blog_helper')

describe('when there is initially some blogs saved', () => {
  let headers
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)

    const newUser = {
      username: 'test',
      name: 'test',
      password: '1234'
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = await api
      .post('/api/login')
      .send(newUser)

    headers = {
      Authorization: `bearer ${result.body.token}`
    }
  }, 10000)

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .set(headers)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('correct amount of blogs', async () => {
    const { response } = await getAllBlogs()
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('identifier is named id', async () => {
    const { response } = await getAllBlogs()
    expect(response.body[0].id).toBeDefined()
  })
  describe('addition new blogs', () => {
    test('Post creates a new blog, total number of blogs is increased by one', async () => {
      await api
        .post('/api/blogs')
        .send(oneBlog)
        .expect(201)
        .set(headers)
        .expect('Content-Type', /application\/json/)

      const finalBlogs = await blogsInDb()
      expect(finalBlogs).toHaveLength(initialBlogs.length + 1)
      const { titles } = await getAllBlogs()
      expect(titles).toContain('blog tres')
    }, 10000)

    test('if we add a blog where likes are missing, deault value must be 0', async () => {
      await api
        .post('/api/blogs')
        .send(oneBlogNoLikes)
        .expect(201)
        .set(headers)
        .expect('Content-Type', /application\/json/)

      const finalBlogs = await blogsInDb()
      expect(finalBlogs).toHaveLength(initialBlogs.length + 1)
      const [lastBlog] = finalBlogs.slice(-1)
      expect(lastBlog.likes).toBe(0)
    }, 10000)

    test('we cant add a blog if title or url is missing,status code expected: 400', async () => {
      await api
        .post('/api/blogs')
        .send(oneBlogNoTitle)
        .expect(400)
        .set(headers)
        .expect('Content-Type', /application\/json/)

      await api
        .post('/api/blogs')
        .send(oneBlogNoUrl)
        .expect(400)
        .set(headers)
        .expect('Content-Type', /application\/json/)

      const finalBlogs = await blogsInDb()
      expect(finalBlogs).toHaveLength(initialBlogs.length)
    }, 10000)

    test('add a blog fail if the token is not provided, status code expected:401', async () => {
      await api
        .post('/api/blogs')
        .send(oneBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const finalBlogs = await blogsInDb()
      expect(finalBlogs).toHaveLength(initialBlogs.length)
    }, 10000)
  })
  describe('deletetion of a blog', () => {
    test('a blog can be deleted, status code expected: 204', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToDelete = blogsAtStart[0]
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
      const blogsAtFinal = await blogsInDb()
      expect(blogsAtFinal).toHaveLength(blogsAtStart.length - 1)

      const { titles } = await getAllBlogs()
      expect(titles).not.toContain(blogToDelete.title)
    })
    test('we can not delete if id is invalid, , status code expected:400', async () => {
      const blogsAtStart = await blogsInDb()
      const id = await nonExistingId()

      await api
        .delete(`/api/blogs/${id}`)
        .expect(400)

      const blogsAtEnd = await blogsInDb()
      expect(blogsAtEnd).toStrictEqual(blogsAtStart)
    })
  })
  describe('updating a blog', () => {
    test('a blog can be updated with the correct id, status code expected: 201', async () => {
      const blogsAtStart = await blogsInDb()
      const { id } = blogsAtStart[0]
      await api
        .put(`/api/blogs/${id}`)
        .send(newBlogUpdated)
        .expect(201)

      const blogsAtEnd = await blogsInDb()
      const expectedBlog = blogsAtEnd[0]
      expect(expectedBlog.likes).toBe(newBlogUpdated.likes)
    })
    test('a blog can not be updated with the wrong id, status code expected: 400', async () => {
      const id = await nonExistingId()
      await api
        .put(`/api/blogs/${id}`)
        .send(newBlogUpdated)
        .expect(400)
    })
  })
})
afterAll(() => {
  mongoose.connection.close()
})
