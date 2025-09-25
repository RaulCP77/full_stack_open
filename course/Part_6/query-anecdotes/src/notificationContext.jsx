import { createContext, useReducer, useContext } from 'react'


const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
        return action.payload
    case "CLEAR_NOTIFICATION":
        return null
    case "RESET_NOTIFICATION":
        return action.payload
    default:
        return state
  }
}

const NotificationContext = createContext()

export const CounterContextProvider = (props) => {
  const [notificationText, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notificationText, notificationDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}
export const useNotificationValue = () => {
    const context = useContext(NotificationContext)
    return context[0]
}
export const useNotificationDispatch = () => {
    const context = useContext(NotificationContext)
    return context[1]
}


export default NotificationContext