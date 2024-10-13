import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegFaceMeh, FaRegFaceFrown, FaRegFaceTired } from "react-icons/fa6";

const symptomList = [
  'Headache', 'Cough', 'Fever', 'Sore throat', 'Fatigue', 'Nausea',
  'Chest pain', 'Shortness of breath', 'Runny nose', 'Body aches'
];

const symptomDrugMap = {
  'Headache': ['aspirin', 'ibuprofen', 'acetaminophen'],
  'Cough': ['codeine', 'dextromethorphan', 'hydrocodone'],
  'Fever': ['ibuprofen', 'acetaminophen', 'naproxen'],
  'Sore throat': ['penicillin', 'amoxicillin'],
  'Fatigue': ['metformin', 'atorvastatin', 'lisinopril'],
  'Nausea': ['metformin', 'lisinopril', 'simvastatin'],
  'Chest pain': ['aspirin', 'nitroglycerin'],
  'Shortness of breath': ['betaBlockers', 'aceInhibitors'],
  'Runny nose': ['antihistamines', 'decongestants'],
  'Body aches': ['ibuprofen', 'acetaminophen', 'naproxen']
};

const SymptomTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [expandedSymptoms, setExpandedSymptoms] = useState([]);
  const [severityMap, setSeverityMap] = useState({});
  const [patientMedicines, setPatientMedicines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch patient metadata when component mounts
    fetchPatientMetadata();
  }, []);

  const fetchPatientMetadata = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/patient/metadata/');
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched patient metadata:", data);
        // Assuming the medicine data is stored in the 'medicine' field of the metadata
        let medicines = [];
        try {
          medicines = JSON.parse(data.medicine);
        } catch (e) {
          console.error("Error parsing medicine data:", e);
          medicines = data.medicine || []; // Use as-is if it's not JSON or default to empty array
        }
        console.log("Parsed patient medicines:", medicines);
        setPatientMedicines(medicines);
      } else {
        console.error('Failed to fetch patient metadata');
      }
    } catch (error) {
      console.error('Error fetching patient metadata:', error);
    }
  };

  const handleFinish = () => {
    navigate('/check');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddSymptom = async () => {
    const formattedSearchTerm = searchTerm.trim().toLowerCase();
    if (formattedSearchTerm && !selectedSymptoms.includes(formattedSearchTerm)) {
      setSelectedSymptoms([...selectedSymptoms, formattedSearchTerm]);
      setSearchTerm('');
      await checkSymptomMedicines(formattedSearchTerm);
    }
  };

  const toggleSymptom = (symptom) => {
    setExpandedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    );
  };

  const checkSymptomMedicines = async (symptom, patientRating = 0) => {
    console.log("Checking symptom medicines for:", symptom);
    console.log("Patient medicines:", patientMedicines);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/patient/check-symptom-medicines/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptom: symptom,
          medicine_guids: patientMedicines
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API response:", data);
        updateSymptomWithMatchingMedicines(symptom, data.matching_medicines);
      } else {
        const errorData = await response.json();
        console.error('Failed to check symptom medicines:', errorData);
      }
    } catch (error) {
      console.error('Error checking symptom medicines:', error);
    }
  };

  const handleSeverityClick = async (symptom, severity) => {
    setSeverityMap((prev) => ({
      ...prev,
      [symptom]: severity
    }));

    // Convert severity to patient_rating
    const patientRating = severity === 'Mild' ? 0 : severity === 'Moderate' ? 1 : 2;

    await checkSymptomMedicines(symptom, patientRating);
  };

  const updateSymptomWithMatchingMedicines = (symptom, matchingMedicines) => {
    setSelectedSymptoms(prevSymptoms => 
      prevSymptoms.map(s => 
        s === symptom ? { name: s, matchingMedicines } : s
      )
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
                onClick={() => toggleSymptom(symptom.name || symptom)}
              >
                {symptom.name || symptom}
              </h2>
              {expandedSymptoms.includes(symptom.name || symptom) && (
                <div>
                  {symptom.matchingMedicines && symptom.matchingMedicines.length > 0 ? (
                    <div>
                      <p className="font-semibold">This may be caused by:</p>
                      <ul className="mt-2 list-disc list-inside text-gray-700">
                        {symptom.matchingMedicines.map((medicine, idx) => (
                          <li key={idx}>{medicine.name}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No associated medicines found.</p>
                  )}
                  <div className="mt-4">
                    <span className="font-semibold">Severity:</span>
                    <div className="flex space-x-4 mt-1">
                      <FaRegFaceMeh
                        onClick={() => handleSeverityClick(symptom.name || symptom, 'Mild')}
                        className={`cursor-pointer ${severityMap[symptom.name || symptom] === 'Mild' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        size={24}
                      />
                      <FaRegFaceFrown
                        onClick={() => handleSeverityClick(symptom.name || symptom, 'Moderate')}
                        className={`cursor-pointer ${severityMap[symptom.name || symptom] === 'Moderate' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        size={24}
                      />
                      <FaRegFaceTired
                        onClick={() => handleSeverityClick(symptom.name || symptom, 'Severe')}
                        className={`cursor-pointer ${severityMap[symptom.name || symptom] === 'Severe' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        size={24}
                      />
                    </div>
                  </div>
                  {severityMap[symptom.name || symptom] && (
                    <div className="mt-2 text-gray-800">
                      <p>
                        Severity level: <strong>{severityMap[symptom.name || symptom]}</strong>
                      </p>
                      {(severityMap[symptom.name || symptom] === 'Moderate') && (
                        <p className="text-yellow-600 mt-1">You may want to contact your primary care provider.</p>
                      )}
                      {(severityMap[symptom.name || symptom] === 'Severe') && (
                        <p className="text-red-600 font-bold mt-1">It is strongly advised that you contact your primary care provider.</p>
                      )}
                    </div>
                  )}
                </div>
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
