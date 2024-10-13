import React, { useState } from 'react';
import { IoHomeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf'; // Import jsPDF

const LogPage = () => {
  const logs = [
    {
      date: '2024-10-01',
      medications: ['Aspirin', 'Metformin'],
      symptoms: [
        { name: 'Headache', severity: 'Mild' },
        { name: 'Fatigue', severity: 'Moderate' }
      ],
    },
    {
      date: '2024-10-02',
      medications: ['Lisinopril'],
      symptoms: [
        { name: 'Nausea', severity: 'Severe' }
      ],
    },
    {
      date: '2024-10-03',
      medications: ['Aspirin'],
      symptoms: [
        { name: 'Headache', severity: 'Mild' }
      ],
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

  // Function to export a single log to PDF
  const exportToPDF = (log) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('Medication and Symptom Log', 105, 20, null, null, 'center');

    // Add date
    doc.setFontSize(16);
    doc.text(`Date: ${log.date}`, 20, 40);

    // Add medications
    doc.setFontSize(14);
    doc.text('Medications:', 20, 50);
    log.medications.forEach((med, idx) => {
      doc.text(`${idx + 1}. ${med}`, 30, 60 + idx * 10);
    });

    // Calculate starting Y position for symptoms
    const symptomsStartY = 60 + log.medications.length * 10 + 10;
    doc.setFontSize(14);
    doc.text('Symptoms:', 20, symptomsStartY);
    log.symptoms.forEach((sym, idx) => {
      doc.text(`${idx + 1}. ${sym.name} (Severity: ${sym.severity})`, 30, symptomsStartY + 10 + idx * 10);
    });

    // Save the PDF
    doc.save(`Log_${log.date}.pdf`);
  };

  // Function to export all logs to a single PDF
  const exportAllToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Medication and Symptom Log', 105, 20, null, null, 'center');
    let y = 40; // Y position for the content

    logs.forEach((log) => {
      doc.setFontSize(16);
      doc.text(`Date: ${log.date}`, 20, y);
      y += 10;

      doc.setFontSize(14);
      doc.text('Medications:', 20, y);
      y += 10;
      log.medications.forEach((med, idx) => {
        doc.text(`${idx + 1}. ${med}`, 30, y);
        y += 10;
      });

      doc.setFontSize(14);
      doc.text('Symptoms:', 20, y);
      y += 10;
      log.symptoms.forEach((sym, idx) => {
        doc.text(`${idx + 1}. ${sym.name} (Severity: ${sym.severity})`, 30, y);
        y += 10;
      });

      y += 10; // Add some space before the next log
    });

    // Save the PDF
    doc.save('All_Logs.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-blue-200 to-green-200 p-6 text-white">
      <h2 className="text-3xl font-semibold text-center mb-6">Medication and Symptom Log</h2>
      <div className="flex flex-col space-y-4">
        {logs.map((log, index) => (
          <div 
            key={index} 
            className="bg-[#24698E] p-4 rounded-lg shadow-lg cursor-pointer" 
            onClick={() => toggleLog(index)}
          >
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
                        <li key={idx} className="text-white">
                          {symptom.name} (Severity: {symptom.severity})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white">None</p>
                  )}
                </div>
                {/* Export to PDF button */}
                <button
                  onClick={(e) => { 
                    e.stopPropagation(); // Prevent toggling the log
                    exportToPDF(log); 
                  }}
                  className="mt-4 bg-blue-500 hover:bg-black text-white font-semibold py-2 px-4 rounded shadow transition duration-200"
                >
                  Export to PDF
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      {/* Button to export all logs to a single PDF */}
      <div className="mt-6">
        <button 
          onClick={exportAllToPDF} 
          className="bg-blue-500 hover:bg-black text-white font-semibold py-2 px-4 rounded shadow transition duration-200"
        >
          Export All Logs to PDF
        </button>
      </div>
      {/* Button to navigate back to /check */}
      <div className="mt-6 flex justify-center">
        <button 
          className="text-white"
          onClick={() => navigate('/check')}
        >
          <IoHomeOutline className="mr-2 text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default LogPage;
