import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const User = () => {
  const blogs = useSelector((state) => state.blogs);
  const { id } = useParams();
  const user = useSelector((state) =>
    state.users ? state.users.find((u) => u.id === id) : null
  );

  if (!user) {
    return null;
  }

  const userBlogs = blogs.filter((blog) => blog.user.username && blog.user.username === user.username);

  return (
    <div style={{ margin: '20px 0 0' }}>
      <h2 style={{textTransform: "capitalize"}}>{user.name}</h2>
      <h3 style={{margin: "20px 0 0"}}>Added blogs</h3>
      {userBlogs.length === 0 ? (
        <p>No blogs added by this user.</p>
      ) : (
        <ul>
          {userBlogs.map((blog) => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default User;