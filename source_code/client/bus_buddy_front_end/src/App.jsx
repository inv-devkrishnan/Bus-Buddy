import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router-dom';
import OwnerUpdateCard from './components/OwnerUpdateCard';
import OwnerRegisterCard from './components/OwnerRegisterCard';

function App() {
  return (
    <div className="App">
    <Routes>
      <Route path='/' element={<OwnerUpdateCard/>} />
      <Route path='/' element={<OwnerRegisterCard/>} />
    </Routes>
    </div>
  );
}

export default App;
