

import './App.css'
import {Routes,Route} from 'react-router-dom' 
import Home from './Home'
import Room from './Room'

function App() {
  
 

  return (
    <>
  <Routes>
    <Route exact path='/' element={<Home/>}/>
    <Route exact path='/room/:roomId' element={<Room/>}/>
  </Routes>
    </>
  )
}

export default App
