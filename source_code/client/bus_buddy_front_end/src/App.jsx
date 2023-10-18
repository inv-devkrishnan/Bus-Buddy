import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router-dom';
import AddRouteCard from './Components/AddRouteCard';

function App() {
  return (
    <div className="App">
    <Routes>
    <Route path='/add-route' element={<AddRouteCard/>} />
    </Routes>
    </div>
  );
}

export default App;