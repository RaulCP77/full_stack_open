import { useNotificationValue } from '../notificationContext'

const Notification = () => {
  const notificationText = useNotificationValue()
  
  console.log('Notification text:', notificationText)

  const NotificationDiv = ()=>{
    if (notificationText === null) {
      return null
    }
    return (
      <div style={style}>
        {notificationText}
      </div>
    ) 
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <NotificationDiv />
  )
}

export default Notification
