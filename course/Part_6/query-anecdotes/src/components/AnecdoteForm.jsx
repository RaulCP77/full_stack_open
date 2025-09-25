import { useQueryClient, useMutation } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../notificationContext'
import { showNotification } from '../utilities/utilities'

const AnecdoteForm = () => {

  const dispatch = useNotificationDispatch()

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote, 
    onSuccess: (anecdote) => {
      queryClient.setQueryData(['anecdotes'], oldAnecdotes => oldAnecdotes.concat(anecdote))
      const message = `anecdote '${anecdote.content}' created`
      showNotification(dispatch, message);
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    if (content.length < 5) {
      showNotification(dispatch, 'too short anecdote, must have length 5 or more');
      return
    } else {
      newAnecdoteMutation.mutate({ content, votes: 0 })
      event.target.anecdote.value = ''
    }
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
