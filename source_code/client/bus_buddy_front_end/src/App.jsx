import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router-dom';
import OwnerRegisterCard from './components/ownerRegisterCard';

function App() {
  return (
    <div className="App">
    <Routes>
      <Route path='/' element={<OwnerRegisterCard/>} />
    </Routes>
    </div>
  );
}

export default App;
