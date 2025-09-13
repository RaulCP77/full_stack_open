import { useRef } from 'react'
import Togglable from "./Toggable"
import PropTypes from 'prop-types'

const Blog = ({ blog, addBlogLike, deleteBlog }) => {
  const blogREf = useRef()
  const blogStyle = {
    padding: "12px 4px",
    border: "1px solid",
    margin: "2px 0x 10px" 
  }
  const moreinfoStyle = {
    display: "block",
    marginBottom: "8px"
  }
  const deleteDiv = {
    display: "block",
    marginBottom: "8px",
    textAlign: "right" 
  }
  const deleteBtn = {
    background: "darkred",
    color: "#fff",
    border: "2px solid darkred",
    padding: "4px"
  }
  const addLikeBtnClicked = (blog) => {  
   addBlogLike(blog)
  }
  const deleteBtnClicked = (blog) => {  
    const blogId = blog.id
   deleteBlog(blogId)
  }

  const userName = blog.user && blog.user.name ? blog.user.name : ''

  return (
    <>
    <div style={blogStyle} className='blog'>
      <p>{blog.title}. Author: {blog.author}</p>
      <Togglable buttonLabel='Show more' buttonLabelClicked="Show less" ref={blogREf}>
        <div style={moreinfoStyle}>
          <p>URL: <a href={blog.url} target='_blank'>{blog.url}</a>. Likes: {blog.likes} <button id='blog_likeBtn' onClick={() => addLikeBtnClicked(blog)}>Like</button></p>
          <p>Blog added by: {userName}</p>
          <div style={deleteDiv}>
            <button style={deleteBtn} onClick={() => deleteBtnClicked(blog)}>Remove this blog</button>
          </div>
        </div>
      </Togglable>
    </div>
    </>
  )
}

Blog.propTypes = {
  deleteBtnClicked: PropTypes.func.isRequired,
  addLikeBtnClicked: PropTypes.func.isRequired,
}

export default Blog