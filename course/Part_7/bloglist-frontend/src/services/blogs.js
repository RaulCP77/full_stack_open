import axios from "axios";

const baseUrl = "/api/blogs/";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const addLike = async (blogId, updatedObject) => {
  const blogUrl = baseUrl + blogId;
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(blogUrl, updatedObject, config);
  return response.data;
};

const deleteBlog = async (blogId) => {
  const blogUrl = baseUrl + blogId;
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(blogUrl, config);
  return response.data;
};

const getAllUsers = async () => {
  const usersUrl = "/api/users";
  const response = await axios.get(usersUrl);
  return response.data;
};

const addComment = async (blogId, comment) => {
  const commentUrl = baseUrl + blogId + "/comments";
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(commentUrl, { comment }, config);
  return response.data;
};

const fetchComments = async (blogId) => {
  const commentUrl = baseUrl + blogId + "/comments";
  const response = await axios.get(commentUrl);
  return response.data;
};

export default { getAll, setToken, createNew, addLike, deleteBlog, getAllUsers, addComment, fetchComments };
