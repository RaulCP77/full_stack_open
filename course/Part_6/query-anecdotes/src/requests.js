import axios from "axios";

export const getAnecdotes = async () => {
  const response = await axios.get('http://localhost:3001/anecdotes');
  return response.data;
};

export const createAnecdote = async (newAnecdote) => {
  const response = await axios.post('http://localhost:3001/anecdotes', newAnecdote);
  return response.data;
};

export const updateAnecdote = async (updatedAnecdote) => {
  const response = await axios.put(
    `http://localhost:3001/anecdotes/${updatedAnecdote.id}`,
    updatedAnecdote
  );
  return response.data;
};