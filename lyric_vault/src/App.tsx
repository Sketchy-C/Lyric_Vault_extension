
import './App.css'
import Transcript from './Components/Board';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() { 

  return (
    <>
    <div className='w-110'>
    <ToastContainer />
      <Transcript />
    </div>

    </>
  )
}

export default App
