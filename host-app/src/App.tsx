import { lazy, Suspense } from 'react'
import './App.css'

const Remote1Button = lazy(() => import('remote-app-1/Button'))

function App() {

  return (
    <div>
      <h1>Host Application</h1>
      
      <Suspense fallback={<div>Loading remote 1 button component...</div>}>
        <Remote1Button 
          label={`Click from Remote`} 
          onClick={() => console.log('Click from Remote')} 
        />
      </Suspense>
    </div>
  )
}

export default App
