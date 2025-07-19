import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import HomeScreen from './home'
import IntercomCallScreen from './accept'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient, { pb } from './queries/client'
import { useEffect } from 'react'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Authenticate />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/accept" element={<IntercomCallScreen />} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

function Authenticate() {
  const navigate = useNavigate()

  useEffect(() => {
    const fn = async () => {
      const auth = await pb
        .collection('users')
        .authWithPassword('webrtc_native', '12345678');
      if (auth) {
        navigate('/home')
      }
    }
    fn()
  }, [])
  return <div className='flex justify-center items-center h-screen'>
    <div className='w-16 h-16 border-4 border-dashed rounded-full animate-spin'></div>
  </div>
}