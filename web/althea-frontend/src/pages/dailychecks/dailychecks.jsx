import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiListHeart } from "react-icons/pi";


const PrescriptionTracker = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [prescriptionsData, setPrescriptionsData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  // useEffect to get the name from local storage
  useEffect(() => {
    const savedName = localStorage.getItem('inputName');
    if (savedName) {
      setName(savedName);
    }

    // Fetch prescriptions data
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/patient/metadata/');
        const data = await response.json();
        console.log('API response:', data); // Debug log

        const prescriptions = data.medicine;
        console.log('Prescriptions:', prescriptions);

        // Fetch medicine names for each prescription
        const prescriptionsWithNames = await Promise.all(
          prescriptions.map(async (prescription) => {
            try {
              const medicineResponse = await fetch(`http://127.0.0.1:8000/api/medicine/${prescription}/`);
              const medicineData = await medicineResponse.json();
              return {
                id: prescription,
                name: medicineData.name
              };
            } catch (error) {
              console.error(`Error fetching medicine data for ${prescription}:`, error);
              return {
                id: prescription,
                name: 'Unknown Medicine'
              };
            }
          })
        );

        setPrescriptionsData(prescriptionsWithNames);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleLogs = () => {
    navigate('/logs');
  }
  
  const handleDone = () => {
    // Filter checked medicines
    const checkedMedicines = prescriptionsData
      .filter(prescription => checkedItems[prescription.id])
      .map(prescription => prescription.id);

    // Store checked medicines in local storage
    localStorage.setItem('medicationsToday', JSON.stringify(checkedMedicines));

    // Navigate to symptoms page
    navigate('/symptoms');
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
      <div className="flex mt-4 space-x-4">
        <button 
          onClick={handleDone} 
          className="bg-[#24698E] hover:bg-[#000000] text-white font-semibold py-2 px-4 border-blue rounded shadow transition duration-200"
        >
          Next
        </button>
        <button 
          onClick={handleLogs} 
          className="text-white"
        >
          <PiListHeart size={24} className="mr-2 text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default PrescriptionTracker;
