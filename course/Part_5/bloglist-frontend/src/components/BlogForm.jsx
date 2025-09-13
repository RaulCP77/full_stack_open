import { useState } from 'react'

const BlogForm = ( {createBlog}) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')

    const clearBLogForm = () => {
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
    }

    const addBlog = async ( event ) => {
        event.preventDefault()
        
        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl,
            likes: 0,
        })
        
        clearBLogForm()
    }  
        
    return (
    <>
        <h2>Create new blog</h2>
        <form onSubmit={addBlog}>
        <div>
            <label htmlFor='Title'>Title: </label>
            <input type='text' name='Title' value={newTitle} onChange={({target}) => setNewTitle(target.value)}></input>
        </div>
        <div>
            <label htmlFor='Author'>Author: </label>
            <input type='text' name='Author' value={newAuthor} onChange={({target}) => setNewAuthor(target.value)}></input>
        </div>
        <div>
            <label htmlFor='Url'>Url: </label>
            <input type='url' name='Url' value={newUrl} onChange={({target}) => setNewUrl(target.value)}></input>
        </div>
        <button type='submit'>Create new blog</button>
        </form>
    </>
    )
}

export default BlogForm
