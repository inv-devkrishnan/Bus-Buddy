import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router-dom';
import RegisterCard from './Components/RegisterCard';

function App() {
  return (
    <div className="App">
    <Routes>
      <Route path='/' element={<RegisterCard/>} />
    </Routes>
    </div>
  );
}

export default App;
