import { useState } from 'react'

const Blog = ({ blog, likeBlog, removeBlog, loggedInUser }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(!visible)
  
  const addLike = () => {
    const updateBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    likeBlog(blog.id, updateBlog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <span>{blog.title} BY {blog.author}</span>
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <span>{blog.likes}</span>
          <button onClick={addLike}>like</button>
          <p>{blog.user.name}</p>
          {loggedInUser.username === blog.user.username ?
            <button onClick={() => removeBlog(blog.id)}>delete</button>
            :
            <></>
          }
          
        </div>
      )}
    </div> 
  )
}

export default Blog