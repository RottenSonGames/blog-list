import axios from 'axios'
const baseUrl = '/api/blogs'

let token = ''

const setToken = (userToken) => token = userToken

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const like = async (id, newBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, newBlog)
  return response.data
}

const remove = async id => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { setToken, getAll, create, like, remove }