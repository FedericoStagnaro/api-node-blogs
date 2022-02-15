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

const entryBlogsAuthor = (blogs) => {
  return blogs.reduce((parcialEntryList, actualBlog) => {
    const indexEntryList = parcialEntryList.findIndex((entry) => entry.author === actualBlog.author)
    if (indexEntryList > -1) {
      const updatedEntry = {
        author: parcialEntryList[indexEntryList].author,
        blogs: parcialEntryList[indexEntryList].blogs + 1
      }
      parcialEntryList[indexEntryList] = updatedEntry
      return parcialEntryList
    } else {
      const newEntry = {
        author: actualBlog.author,
        blogs: 1
      }
      return parcialEntryList.concat(newEntry)
    }
  }, [])
}

const getEntryLikesBlogs = (blogs) => {
  return blogs.reduce((parcialEntryList, actualBlog) => {
    const indexEntryList = parcialEntryList.findIndex((entry) => entry.author === actualBlog.author)

    if (indexEntryList > -1) {
      const updatedEntry = {
        author: parcialEntryList[indexEntryList].author,
        likes: parcialEntryList[indexEntryList].likes + actualBlog.likes
      }
      parcialEntryList[indexEntryList] = updatedEntry
      return parcialEntryList
    } else {
      const newEntry = {
        author: actualBlog.author,
        likes: actualBlog.likes
      }
      return parcialEntryList.concat(newEntry)
    }
  }, [])
}

const mostLikes = (blogs) => {
  const entryList = getEntryLikesBlogs(blogs)

  console.log(entryList)
  if (entryList.length > 0) {
    let mostLikes = { likes: 0 }
    entryList.forEach(entry => {
      if (entry.likes > mostLikes.likes) { mostLikes = entry }
    })
    return mostLikes
  } else { return null }
}

const mostBlogs = (blogs) => {
  const entryBlogs = entryBlogsAuthor(blogs)

  if (entryBlogs) {
    let mostBlogs = { blogs: 0 }
    entryBlogs.forEach(entry => {
      if (mostBlogs.blogs < entry.blogs) { mostBlogs = entry }
    })
    return mostBlogs.blogs > 0 ? mostBlogs : null
  } else { return null }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
