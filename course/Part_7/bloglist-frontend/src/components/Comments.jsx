

const Comments = ({ comments }) => {
  return (
     <div style={{ marginTop: '10px', padding: '0px 20px 40px' }}>
      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comments;