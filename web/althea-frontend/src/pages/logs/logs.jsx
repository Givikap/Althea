import React, { useState } from 'react';
import { IoHomeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const LogPage = () => {
  const logs = [
    {
      date: '2024-10-01',
      medications: ['Aspirin', 'Metformin'],
      symptoms: ['Headache', 'Fatigue'],
    },
    {
      date: '2024-10-02',
      medications: ['Lisinopril'],
      symptoms: ['Nausea'],
    },
    {
        date: '2024-10-03',
        medications: ['Aspirin'],
        symptoms: ['Headache'],
      },
  ];

  // State to track which log is expanded
  const [expandedLogIndex, setExpandedLogIndex] = useState(null);
  
  // Use navigate hook for navigation
  const navigate = useNavigate();

  // Function to handle click to toggle expanded log
  const toggleLog = (index) => {
    setExpandedLogIndex(expandedLogIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-blue-200 to-green-200 p-6 text-white">
      <h2 className="text-3xl font-semibold text-center mb-6">Medication and Symptom Log</h2>
      <div className="flex flex-col space-y-4">
        {logs.map((log, index) => (
          <div key={index} className="bg-[#24698E] p-4 rounded-lg shadow-lg cursor-pointer" onClick={() => toggleLog(index)}>
            <h3 className="text-xl font-semibold mb-2">{log.date}</h3>
            {expandedLogIndex === index && (
              <>
                <div>
                  <strong>Medications:</strong>
                  {log.medications.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {log.medications.map((medication, idx) => (
                        <li key={idx} className="text-white">{medication}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white">None</p>
                  )}
                </div>
                <div>
                  <strong>Symptoms:</strong>
                  {log.symptoms.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {log.symptoms.map((symptom, idx) => (
                        <li key={idx} className="text-white">{symptom}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white">None</p>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {/* Button to navigate back to /check */}
      <div className="mt-6 flex justify-center">
        <button 
          className="flex items-center justify-center text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate('/check')}
        >
          <IoHomeOutline className="mr-2 text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default LogPage;
