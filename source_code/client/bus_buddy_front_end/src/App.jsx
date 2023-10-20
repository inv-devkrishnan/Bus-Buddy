import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router-dom';
import OwnerUpdateCard from './components/OwnerUpdateCard';
import OwnerRegisterCard from './components/OwnerRegisterCard';
import RegisterCard from './Components/RegisterCard';
import UpdateForm from './Components/UpdateFormCard'

function App() {
  return (
    <div className="App">
    <Routes>
      <Route path='/' element={<OwnerUpdateCard/>} />
      <Route path='/' element={<OwnerRegisterCard/>} />
    <Route path='/register-user' element={<RegisterCard/>} />
      <Route path='/update-user' element={<UpdateForm/>} />
    </Routes>
    </div>
  );
}

export default App;
