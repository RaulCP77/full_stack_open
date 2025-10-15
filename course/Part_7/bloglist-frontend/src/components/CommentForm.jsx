import { useState } from 'react';
import  Comments from './Comments'; 
import blogService from '../services/blogs';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const CommentForm = (id) => {
  const [comments, setComments] = useState([]);
  const blogId = id.id;

    useState(() => {
        const fetchComments = async () => {
            const fetchedComments = await blogService.fetchComments(blogId);
            setComments(fetchedComments);
        };
        fetchComments();
    }, []);

    const handleAddComment = async (event) => {
        event.preventDefault();
        const comment = event.target.comment.value;
        const newComment = await blogService.addComment(blogId, comment);
        setComments(prevComments => [...prevComments, comment]);
        event.target.comment.value = '';
    };
  return (
    <div>
      <div style={{ marginTop: '20px', backgroundColor: '#f8f9fa', padding: '20px 20px 40px' }}>
      <h2>Add a comment</h2>
      <Form onSubmit={handleAddComment}>
        <Form.Control as="textarea" name="comment" rows={3} />
        <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>Add comment</Button> 
      </Form>
      </div>
      <Comments comments={comments} />
    </div>
  );
};

export default CommentForm;