import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CounterContextProvider } from './notificationContext'

import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
})

const AppWrapper = () => (
  <QueryClientProvider client={queryClient}>
    <CounterContextProvider>
      <App />
    </CounterContextProvider>
  </QueryClientProvider>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppWrapper />
)