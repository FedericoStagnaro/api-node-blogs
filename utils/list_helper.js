const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((prevLikes, blog) => prevLikes + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length > 0) {
    const popularBlog = blogs.reduce((prevBlog, actualBlog) => { return prevBlog.likes < actualBlog.likes ? actualBlog : prevBlog }, { likes: 0 })
    return popularBlog
  } else {
    return null
  }
}

module.exports = { dummy, totalLikes, favoriteBlog }
