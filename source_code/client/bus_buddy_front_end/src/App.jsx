import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router-dom';
import AddRouteCard from './components/AddRouteCard';
import ViewAllRoutes from './components/ViewAllRoutes';

function App() {
  return (
    <div className="App">
    <Routes>
    <Route path='/add-route' element={<AddRouteCard/>} />
    <Route path='/view-route' element={<ViewAllRoutes/>}/>
    </Routes>
    </div>
  );
}

export default App;