import { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const clearBLogForm = () => {
    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };

  const addBlog = async (event) => {
    event.preventDefault();

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0,
    });

    clearBLogForm();
  };

  return (
    <>
      <h2>Create new blog</h2>
      <Form onSubmit={addBlog}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={newTitle}
            name="Title"
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            value={newAuthor}
            name="Author"
            onChange={({ target }) => setNewAuthor(target.value)}
          /> 
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Url</Form.Label>
          <Form.Control
            type="url"
            value={newUrl}
            name="Url"
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Create new blog</Button>
      </Form>
    </>
  );
};

export default BlogForm;
