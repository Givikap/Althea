import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const symptomList = [
  'Headache', 'Cough', 'Fever', 'Sore throat', 'Fatigue', 'Nausea',
  'Chest pain', 'Shortness of breath', 'Runny nose', 'Body aches'
];

const symptomDrugMap = {
  'Headache': ['Aspirin', 'Ibuprofen', 'Acetaminophen'],
  'Cough': ['Codeine', 'Dextromethorphan', 'Hydrocodone'],
  'Fever': ['Ibuprofen', 'Acetaminophen', 'Naproxen'],
  'Sore throat': ['Penicillin', 'Amoxicillin'],
  'Fatigue': ['Metformin', 'Atorvastatin', 'Lisinopril'],
  'Nausea': ['Metformin', 'Lisinopril', 'Simvastatin'],
  'Chest pain': ['Aspirin', 'Nitroglycerin'],
  'Shortness of breath': ['Beta-blockers', 'ACE inhibitors'],
  'Runny nose': ['Antihistamines', 'Decongestants'],
  'Body aches': ['Ibuprofen', 'Acetaminophen', 'Naproxen']
};

const SymptomTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [expandedSymptoms, setExpandedSymptoms] = useState([]);
  const navigate = useNavigate();

  const handleFinish = () => {
    navigate('/check'); // Navigate to daily checks page
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddSymptom = () => {
    const formattedSearchTerm = searchTerm.trim();
    if (symptomList.includes(formattedSearchTerm) && !selectedSymptoms.includes(formattedSearchTerm)) {
      setSelectedSymptoms([...selectedSymptoms, formattedSearchTerm]);
      setSearchTerm(''); // Clear the input field
    }
  };

  const toggleSymptom = (symptom) => {
    setExpandedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-blue-200 to-green-200 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-white mb-6">Symptom Tracker</h1>
      
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Type your symptom..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 mb-4 rounded-lg shadow-lg"
        />
        <button
          onClick={handleAddSymptom}
          className="w-full p-3 bg-[#24698E] text-white rounded-lg hover:bg-black transition duration-200"
        >
          Add Symptom
        </button>
      </div>

      {selectedSymptoms.length > 0 && (
        <div className="w-full max-w-md mt-6">
          {selectedSymptoms.map((symptom, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-lg mb-4">
              <h2
                className="text-lg font-semibold cursor-pointer text-blue-600"
                onClick={() => toggleSymptom(symptom)}
              >
                {symptom}
              </h2>
              {expandedSymptoms.includes(symptom) && (
                <ul className="mt-2 list-disc list-inside text-gray-700">
                  {symptomDrugMap[symptom] ? (
                    symptomDrugMap[symptom].map((drug, idx) => (
                      <li key={idx}>{drug}</li>
                    ))
                  ) : (
                    <li>No associated drugs found.</li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <button 
        onClick={handleFinish} 
        className="mt-4 bg-[#24698E] hover:bg-black text-white font-semibold py-2 px-4 rounded shadow transition duration-200"
      >
        Complete
      </button>
    </div>
  );
};

export default SymptomTracker;
