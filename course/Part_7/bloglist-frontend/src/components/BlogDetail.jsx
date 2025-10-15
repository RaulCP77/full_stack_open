import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { initializeBlogs } from "../reducers/blogReducer";
import useBlogActions  from "../hooks/useBlogActions";
import CommentForm from "./CommentForm";
import Button from "react-bootstrap/esm/Button";

const BlogDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const blogs = useSelector((state) => state.blogs);

    useEffect(() => {
      if (!blogs || blogs.length === 0) {
        dispatch(initializeBlogs());
      }
    }, [dispatch, blogs]);

    const blog = blogs ? blogs.find((b) => b.id === id) : null;
    const { addBlogLike, deleteBlog } = useBlogActions(blog);

    if (!blog) {
      return <p>Loading blogs...</p>;
    }

  return (
    <div style={{ margin: '20px 0 0' }}>
      <h2>{blog.title}</h2>
        <p>Author: {blog.author}</p>
        <p>URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
        <p>Likes: {blog.likes}
            <Button variant="primary" id="blog_likeBtn" size="sm" style={{ marginLeft: 5 }} onClick={() => addBlogLike(blog)}>Like</Button>
        </p>
        <p>Added by: {blog.user && blog.user.name ? blog.user.name : "Unknown"}
        {blog.user && blog.user.username === blog.user.username && (
            <span style={{ textAlign: "right" }}>
                <Button variant="danger" size="sm" style={{
                        marginLeft: 5
                    }} onClick={() => deleteBlog(blog)}>Delete</Button>
            </span>
        )}
        </p>
        <CommentForm id={id} />
    </div>
  );
};

export default BlogDetail;