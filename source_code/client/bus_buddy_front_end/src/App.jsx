import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router-dom';
import OwnerUpdateCard from './components/OwnerUpdateCard';
import OwnerRegisterCard from './components/OwnerRegisterCard';
import RegisterCard from './components/RegisterCard';
import UpdateForm from './components/UpdateFormCard'

function App() {
  return (
    <div className="App">
    <Routes>
      <Route path='/update-owner' element={<OwnerUpdateCard/>} />
      <Route path='/register-owner' element={<OwnerRegisterCard/>} />
    <Route path='/register-user' element={<RegisterCard/>} />
      <Route path='/update-user' element={<UpdateForm/>} />
    </Routes>
    </div>
  );
}

export default App;
