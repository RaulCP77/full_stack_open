import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from "../services/anecdotes"

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    voteAnecdote(state, action) {
      const id = action.payload.id
      const anecdote = state.find(anecdote => anecdote.id === id)
      if (anecdote) {
        anecdote.votes += 1
      }
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    }    
  }
})

export const { voteAnecdote, appendAnecdote, setAnecdotes, createAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createNewAnecdote = (content) => {
  return async dispatch => {
   const newAnecdote = await anecdoteService.createNew(content)
   dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdoteById = (id) => {
  return async dispatch => {
    const anecdoteToChange = await anecdoteService.findById(id)
    const changedAnecdote = await anecdoteService.updateAnecdote(anecdoteToChange.id, {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1
    })
    dispatch(voteAnecdote(changedAnecdote.id))
  }
}

export default anecdoteSlice.reducer