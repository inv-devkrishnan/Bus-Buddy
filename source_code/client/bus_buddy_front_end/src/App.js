import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BusHome from "./components/Bus_ui/BusHome";
import Addbus from './components/Bus_ui/Addbus';
import Deletebus from './components/Bus_ui/Deletebus';
import Updatebus from './components/Bus_ui/Updatebus';
import Viewbus from './components/Bus_ui/Viewbus';
import Addamenities from './components/Bus_ui/Addamenities';
import Updateamenities from './components/Bus_ui/Updateamenities'
import 'bootstrap/dist/css/bootstrap.css';
import Addroutes from './components/route_ui/Addroutes';
import Deleteroutes from './components/route_ui/Deleteroutes';
import Updateroutes from './components/route_ui/updateroutes';
import Viewroutes from './components/route_ui/viewroutes';

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
              <Route path='/Updateamenities' element={<Updateamenities/>}/>
              <Route path='/Viewbus' element={<Viewbus/>}/>
              <Route path='/Addamenities' element={<Addamenities/>}/>
              <Route path='/Addroutes' element={<Addroutes/>}/>
              <Route path='/Deleteroutes' element={<Deleteroutes/>}/>
              <Route path='/Updateroutes' element={<Updateroutes/>}/>
              <Route path='/Viewroutes' element={<Viewroutes/>}/>
            </Routes>
          </React.Fragment>
        </Router>
    </div>
  );
}

export default App;
