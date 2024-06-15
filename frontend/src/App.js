import React from 'react';
import LoginForm from './templates/LoginForm';
import MachinesList from './templates/machine';
import MachineForm from './templates/form';

const App = () => {
    return (
        <div className="App">
            
            
                <MachinesList />
            
              
        </div>
    );
};

export default App;/*
import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './templates/home';
import About from './templates/about';
import Contact from './templates/contact';
import LoginForm from './templates/LoginForm';
import MachinesList from './templates/machine';
import MachineForm from './templates/form';
import UpdateMachineForm from './templates/update';
import './App.css';

const App = () => {
  return (
    <div>
      

      <main>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/machines" element={<MachinesList />} />
          <Route path="/form" element={<MachineForm />} />
          <Route path="/update" element={<UpdateMachineForm />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;*/

