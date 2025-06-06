import { useState } from 'react'

const Anecdotes = ({ anecdote }) => {
  return (
    <div>
        <p>
          {anecdote}
        </p>
    </div>
  )
} 
const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  function addVote(index) {
    const copy = [...votes]
    copy[index] += 1
    setVotes(copy)
  }

  return (
    <>
    <h1>Anecdote of the day</h1>
    <Anecdotes anecdote={anecdotes[selected]} />
    <div>
      <p>has {votes[selected]} votes</p>
    </div>
    <div>
      <Button text="Vote" onClick={() => addVote(selected)} />
      <Button text="Next anecdote" onClick={() => setSelected(Math.floor(Math.random() * anecdotes.length))} />
    </div>
    <h2>Anecdote with most votes</h2>
    <Anecdotes anecdote={
      votes.some(vote => vote > 0) 
        ? anecdotes[votes.indexOf(Math.max(...votes))] 
        : 'No votes yet'
    } />
    <p>
      {votes.some(vote => vote > 0) 
        ? `has ${Math.max(...votes)} votes` 
        : ''}
    </p>
  </>
  )
}

export default App