import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Users from "./components/Users";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Toggable";
import User from "./components/User";
import { showNotification } from './reducers/notificationReducer'
import { initializeBlogs, createNewBlog, likeBlog, deleteBlog as removeBlog } from './reducers/blogReducer'
import { initializeUser, logoutUser, setUser } from './reducers/userReducer'
import { fetchUsers } from './reducers/usersREducer'
import BlogDetail from "./components/BlogDetail";
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const App = () => {
  const blogsFromState = useSelector((state) => state.blogs);
  const blogFormRef = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector((state) => state.user);
  
  const dispatch = useDispatch();
  const notificationMessage = useSelector((state) => state.notification.message);
  const notificationType = useSelector((state) => state.notification.type);

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(fetchUsers());
  }, [dispatch]);
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const userLogged = JSON.parse(loggedUserJSON);
      blogService.setToken(userLogged.token); // set token for API calls
      dispatch(setUser(userLogged));
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      dispatch(initializeUser({username, password}))
      setUsername("");
      setPassword("");
    } catch {
      dispatch(showNotification("Wrong username or password", 5, "error"))
    }
  };

  const closeSession = () => {
    window.localStorage
      ? window.localStorage.removeItem("loggedBlogAppUser")
      : null;
    dispatch(logoutUser())
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      dispatch(createNewBlog(blogObject))
      dispatch(showNotification(`New blog: ${blogObject.title}, created by: ${blogObject.author}`, 5, "success"))
    } catch {
      dispatch(showNotification(`Error creating the new note`, 5, "error"))
    }
  };
  const loginForm = () => {
    return (
      <>
        <h2>Login to application</h2>
        <Form onSubmit={handleLogin}>
          <Form.Label>Username</Form.Label>
          <Form.Control
            name="Username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          ></Form.Control>
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="Password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          ></Form.Control>
          <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>Login</Button>
        </Form>
      </>
    );
  };
  const blogList = () => {
    return (
      <>
       <div style={{ marginTop: 20, marginBottom: 20 }}>
        <h2>List of blogs</h2>
        {blogsFromState
          .slice()
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
            />
          ))}       
       </div>
      </>
    );
  };

  const notificationArea = () => {
    
    return (
      <>
      {notificationMessage && (
        <div className={`notification ${notificationType}`}>
          <p>{notificationMessage}</p>
        </div>
      )}
      </>
    );
  };
  return (
    <>
      <Container>
        <Row>
          <Col>
            <Router>
            <Navbar expand="lg" className="bg-body-tertiary" style={{padding: "8px"}}>
              <Navbar.Brand href="#">Blog App</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Link style={{ padding: 5 }} to="/">blogs</Link>
                  <Link style={{ padding: 5 }} to="/users">users</Link>
                </Nav>
              {user.name} logged-in{" "}
              <Button variant="primary" size="sm" style={{ marginLeft: 5 }} onClick={() => closeSession()}>
                Login out
              </Button>
              </Navbar.Collapse>
            </Navbar>
            <h1 style={{ color: 'black', margin: '20px 0 10px' }}>Blog App</h1>
            <Routes>
              <Route path="/users" element={<Users />} />
              <Route path="/" element={
                <>
                  {blogsFromState.length === 0 && <p>No blogs added yet</p>}
                  {notificationArea()}
                  {!user.username  ? (
                    loginForm()
                  ) : (
                    <div>
                      <Togglable
                        buttonLabel="Create blog"
                        buttonLabelClicked="Cancel"
                        ref={blogFormRef}
                      >
                        <BlogForm createBlog={addBlog} user={user} />
                      </Togglable>
                      {blogList()}
                    </div>
                  )}
                </>
              } />
              <Route path="/users/:id" element={<User />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
            </Routes>
            </Router>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
