
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => blogs.reduce((a, b) => a + b.likes, 0)

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map(b => b.likes))
  const maxBlog = blogs.filter(b => b.likes === maxLikes)
  return {
    title: maxBlog[0].title,
    author: maxBlog[0].author,
    likes: maxBlog[0].likes
  }
}

const mostBlogs = (blogs) => {
  let authorBlogs = {
    author: '',
    blogs: 0
  }
  const authors = [...new Set(blogs.map(b => b.author))]

  authors.forEach(author => {
    const numBlogs = blogs.filter(b => b.author === author)
    if (numBlogs.length > authorBlogs.blogs) {
      authorBlogs = {
        author,
        blogs: numBlogs.length
      }
    }
  })
  return authorBlogs
}
const mostLikes = (blogs) => {
  let authorLikes = {
    author: '',
    likes: 0
  }

  const authors = [...new Set(blogs.map(b => b.author))]

  authors.forEach(author => {
    const blogsAuthor = blogs.filter(b => b.author === author)
    const likes = blogsAuthor.reduce((a, b) => a + b.likes, 0)
    if (likes > authorLikes.likes) {
      authorLikes = {
        author,
        likes
      }
    }
  })
  return authorLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
