import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router-dom';
import OwnerUpdateCard from './components/OwnerUpdateCard';
function App() {
  return (
    <div className="App">
    <Routes>
      <Route path='/' element={<OwnerUpdateCard/>} />
    </Routes>
    </div>
  );
}

export default App;