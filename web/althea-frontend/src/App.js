import React, { useState, useEffect } from 'react';
import { TbMedicineSyrup } from 'react-icons/tb';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrescriptionTracker from './pages/dailychecks/dailychecks';
import SymptomTracker from './pages/symptoms/symptomchecks';
import LogPage from './pages/logs/logs';
import Redirect from './useRouting';
import Select from './Select';
import './styles/fonts.css';
import useTypewriter from './typewritehook'; // Import the custom hook

function App() {
  const [name, setName] = useState('');
  const [is, setIs] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // 
  const typewriterText = "YYour prescription and medical symptom tracking companion"; // Text for typewriter effect
  const displayedText = useTypewriter(typewriterText, 100); //

  useEffect(() => {
    const savedName = localStorage.getItem('inputName');
    if (savedName) {
      setIs(true);
    } else {
      console.log('no');
    }
  }, [name]);

  useEffect(() => {
    localStorage.setItem('inputName', name);
  }, [name]);

  useEffect(() => {
    // Set a timeout to change the visibility after 0.5 seconds
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Adjust the delay as needed

    return () => clearTimeout(timeout); // Cleanup timeout on component unmount
  }, []);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-r from-indigo-200 via-blue-200 to-green-200 text-white flex flex-col justify-center items-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <header className="text-6xl font-Ubuntu text-center mb-6">
        Welcome to
      </header>
      <div className="text-5xl font-sinera text-center mb-4">
        Althea
      </div>
      <TbMedicineSyrup size={60} color="#FFFFFF" />
      {/* Typewriter Text */}
      <div className="text-lg text-center mt-2">{displayedText}</div> {/* Displaying the typewriter text */}
      <div className="flex flex-col justify-center items-center space-y-4">
        <div className="flex flex-col mt-8 items-center">
          <input 
            type='text' 
            placeholder='Enter Your Name' 
            value={name}
            onChange={handleChange} // Update the name state on input change
            className="block text-gray-500 mb-1 md:mb-0 pr-4 focus:outline-none focus:ring-2 focus:bg-[#FFFFFF]"
          />
        </div>
        {is ? (
          <Redirect />
        ) : (
          <p className="text-red-500 mt-4">Please enter your name to proceed.</p>
        )}
      </div>
    </div>
  );
}

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />  
        <Route path="/select" element={<Select />} />
        <Route path="/check" element={<PrescriptionTracker />} />
        <Route path="/symptoms" element={<SymptomTracker />} />
        <Route path="/logs" element={<LogPage />} /> 
      </Routes>
    </Router>
  );
}

export default Main;
