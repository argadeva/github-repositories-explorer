import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import FindUsers from './FindUsers'
import './App.css'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FindUsers />
    </QueryClientProvider>
  )
}
