import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrescriptionTracker = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  // useEffect to get the name from local storage
  useEffect(() => {
    const savedName = localStorage.getItem('inputName');
    if (savedName) {
      setName(savedName);
    }
  }, []);

  const [checkedItems, setCheckedItems] = useState({});

  const prescriptionsData = [
    { id: 1, name: 'Aspirin' },
    { id: 2, name: 'Metformin' },
    { id: 3, name: 'Lisinopril' },
    { id: 4, name: 'Atorvastatin' },
    { id: 5, name: 'Omeprazole' },
    { id: 6, name: 'Simvastatin' },
  ];

  const handleDone = () => {
    navigate('/symptoms'); // Navigate to symptoms page
  };

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-blue-200 to-green-200 flex flex-col justify-center items-center p-6">
      <h2 className="text-2xl justify-center font-semibold mb-4 text-white">Hello, {name}!</h2> {/* Display the name */}
      <div className="mb-4 w-full max-w-md bg-[#24698E] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl text-center font-semibold mb-2 text-white">Medications Taken Today</h2>
        <div className="flex flex-col">
          {prescriptionsData.map((prescription) => (
            <div key={prescription.id} className="flex justify-center items-center">
              <input
                type="checkbox"
                id={`prescription-${prescription.id}`}
                checked={!!checkedItems[prescription.id]}
                onChange={() => handleCheckboxChange(prescription.id)}
                className="mr-2"
              />
              <label htmlFor={`prescription-${prescription.id}`} className="text-lg text-white">
                {prescription.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={handleDone} 
        className="mt-4 bg-[#24698E] hover:bg-[#000000] text-white font-semibold py-2 px-4 border-blue rounded shadow transition duration-200"
      >
        Next
      </button>
    </div>
  );
};

export default PrescriptionTracker;
