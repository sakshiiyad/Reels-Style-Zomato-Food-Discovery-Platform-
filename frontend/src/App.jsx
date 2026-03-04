import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from './routes/Approutes'

const App = () => {
  return (
    <div>
      <AppRoutes />
      <ToastContainer />
    </div>
  )
}
export default App;

