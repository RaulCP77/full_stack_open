import { useSelector } from "react-redux";
import { Link, Route, Router } from "react-router-dom";
import Table from "react-bootstrap/Table";

const Users = () => {
  const users = useSelector((state) => state.users);

  if (!users || users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <div style={{ margin: '20px 0 0' }}>
      <h2>Users</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>{user.blogs ? user.blogs.length : 0}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;