import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router-dom';
import UpdateForm from './components/UpdateFormCard'
function App() {
  return (
    <div className="App">
    <Routes>
      <Route path='/' element={<UpdateForm/>} />
    </Routes>
    </div>
  );
}

export default App;
