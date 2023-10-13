import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BusHome from "./components/BusHome";
import Addbus from './components/Addbus';
import Deletebus from './components/Deletebus';
import Updatebus from './components/Updatebus';
import Viewbus from './components/Viewbus';



function App() {
  return (
    <div>
        <Router>
          <React.Fragment>
            <Routes>
              <Route path='/BusHome' element={<BusHome/>}/>
              <Route path='/Addbus' element={<Addbus/>}/>
              <Route path='/Deletebus' element={<Deletebus/>}/>
              <Route path='/' element={<Updatebus/>}/>
              <Route path='/Viewbus' element={<Viewbus/>}/>
            </Routes>
          </React.Fragment>
        </Router>
    </div>
  );
}

export default App;
