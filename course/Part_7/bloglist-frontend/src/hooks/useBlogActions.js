import { useCallback } from "react";
import { useDispatch } from "react-redux";
import blogService from "../services/blogs";
import { likeBlog, removeBlog } from "../reducers/blogReducer";
import { showNotification } from "../reducers/notificationReducer";

const useBlogActions = (blog) => {
    const dispatch = useDispatch();
    const blogId = blog?.id;
    
    const addBlogLike = useCallback(async() => {
            try {
              const updatedBlog = await blogService.addLike(blogId, {
                title: blog.title,
                author: blog.author,
                url: blog.url,
                likes: blog.likes + 1,
              });
              dispatch(likeBlog(blogId))
              dispatch(showNotification(`Blog liked successfully`, 5, "success"))
            } catch {
              dispatch(showNotification(`Error updating the blog`, 5, "error"))
            }
    }, [blog]);

    const deleteBlog = useCallback(() => {
        try {
          dispatch(removeBlog(blogId))
          dispatch(showNotification(`Blog deleted successfully`, 5, "success"))
        } catch {
          dispatch(showNotification(`Error deleting the blog`, 5, "error"))
        }
        
    }, [blog]);

    return { addBlogLike, deleteBlog };
};

export default useBlogActions;