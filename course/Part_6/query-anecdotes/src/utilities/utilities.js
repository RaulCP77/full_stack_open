let currentTimeout;

export const showNotification = (dispatch, message, duration = 5000) => {
  dispatch({ type: 'SET_NOTIFICATION', payload: message });

  if (currentTimeout) {
    clearTimeout(currentTimeout);
  }

  currentTimeout = setTimeout(() => {
    dispatch({ type: 'CLEAR_NOTIFICATION' });
  }, duration);
};
