import { useRef } from "react";
import Togglable from "./Toggable";
import { Link } from "react-router-dom";
import useBlogActions from '../hooks/useBlogActions';
import Button from "react-bootstrap/esm/Button";

const Blog = ({ blog }) => {
  const blogREf = useRef();
  const { addBlogLike, deleteBlog } = useBlogActions(blog);
  
  const blogStyle = {
    padding: "12px 20px",
    borderBottom: "12px solid #ffffff",
    margin: "2px 0x 18px",
    backgroundColor: "#f8f9fa",
  };
  const moreinfoStyle = {
    display: "block",
    marginBottom: "8px",
  };
  const deleteDiv = {
    display: "block",
    marginBottom: "8px",
    textAlign: "right",
  };

  const userName = blog.user && blog.user.name ? blog.user.name : "";

  return (
    <>
      <div style={blogStyle} className="blog">
        <p>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title}
          </Link>
          . Author: {blog.author}
        </p>
        <Togglable
          buttonLabel="Show more"
          buttonLabelClicked="Show less"
          ref={blogREf}
        >
          <div style={moreinfoStyle}>
            <p>
              URL:{" "}
              <a href={blog.url} target="_blank">
                {blog.url}
              </a>
              . Likes: {blog.likes}{" "}
              <Button variant="primary" size="sm" style={{ marginLeft: 5 }} onClick={() => addBlogLike(blog)}>Like</Button>
            </p>
            <p>Blog added by: {userName}</p>
            <div style={deleteDiv}>
              <Button variant="danger" size="sm" onClick={() => deleteBlog(blog)}>Remove this blog</Button>
            </div>
          </div>
        </Togglable>
      </div>
    </>
  );
};

export default Blog;
