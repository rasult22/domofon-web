import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeScreen from './home'
import IntercomCallScreen from './accept'
import { NotFound } from './components/NotFound'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './queries/client'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/accept" element={<IntercomCallScreen />} />
          {/* 404 Route - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App