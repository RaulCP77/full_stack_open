import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'



const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const createContext = async(event) => {
        event.preventDefault()
        const content = event.target.context.value
        event.target.context.value = ''
        dispatch(createAnecdote(content))
        dispatch(showNotification(`You created '${content}'`, 5))
    }

  return (
    <>
      <h2>Create new</h2>
      <form onSubmit={createContext}>
        <div><input name='context'  /></div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm