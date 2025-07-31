import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Message from './components/Message'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  //states for user and login
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  
  //states and ref for blogs
  const [blogs, setBlogs] = useState([])
  const [sortLikes, setSortLikes] = useState(false)
  const blogsSorted = sortLikes 
                            ? blogs.sort((b1,b2) => {return b2.likes - b1.likes})
                            : blogs
  const blogFormRef = useRef()

  //states for notifications and errors
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(true)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
    const loggedInUser = JSON.parse(localStorage.getItem('user'))
    if (loggedInUser) {
      setUser(loggedInUser)
      blogService.setToken(loggedInUser.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const loginUser = await loginService.login({ username, password })
      setUser(loginUser)
      window.localStorage.setItem('user', JSON.stringify(loginUser))
      blogService.setToken(loginUser.token)

      setMessage('successfully logged in!')
      setTimeout(() => {
        setMessage('')
      }, 3000)

      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('invalid username or password!')
      setSuccess(false)
      setTimeout(() => {
        setMessage('')
        setSuccess(true)
      }, 3000)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    blogService.setToken(null)

    setMessage('successfully logged out!')
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  const createBlog = async blogObject => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      setMessage('new blog added!')
      setTimeout(() => {
        setMessage('')
      }, 3000)

      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      setMessage('failed to create new blog!')
      setSuccess(false)
      setTimeout(() => {
        setMessage('')
        setSuccess(true)
      }, 3000)
    }
  }

  const removeBlog = async id => {
    const blogToRemove = blogs.find(blog => blog.id === id)
    if (!window.confirm(`Are you sure you want to delete blog ${blogToRemove.title}`)) return

    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setMessage('blog deleted successfully!')
      setTimeout(() => {
        setMessage('')
      }, 3000)
    } catch (exception) {
      setMessage('failed to delete blog!')
      setSuccess(false)
      setTimeout(() => {
        setMessage('')
        setSuccess(true)
      }, 3000)
    }
  }

  const likeBlog = async (id, blogObject) => {
    try {
      const likedBlog = await blogService.like(id, blogObject)
      setBlogs(blogs.map(blog => blog.id === id ? likedBlog : blog))
    } catch (exception) {
      setMessage('could not like blog!')
      setSuccess(false)
      setTimeout(() => {
        setMessage('')
        setSuccess(true)
      }, 3000)
    }
  }


  return (
    <>
    <Message message={message} success={success} />

    {user === null
      ? <LoginForm
          handleLogin={handleLogin}
          username={username} setUsername={setUsername}
          password={password} setPassword={setPassword}
        />
      : <div>
          <h1>blogs</h1>
            <div>
              {user.username} logged in
              <button onClick={handleLogout}>logout</button>
            </div>
          <h2>create new</h2>
            <Togglable buttonLabel="add blogs" ref={blogFormRef}>
              <BlogForm createBlog={createBlog}/>
            </Togglable>
          <h2>your saved blogs</h2>
            <div>
              <button onClick={() => setSortLikes(!sortLikes)}>
                sort by likes
              </button>
              {blogsSorted.map(blog =>
                <Blog key={blog.id} blog={blog}
                  likeBlog={likeBlog} removeBlog={removeBlog}
                  loggedInUser={user}
                />
              )}
            </div>
        </div>
    }
    </> 
  )
}

export default App