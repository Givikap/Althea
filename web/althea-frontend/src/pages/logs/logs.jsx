import React, { useState, useEffect } from 'react';
import { IoHomeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf'; // Import jsPDF

const LogPage = () => {
  const [logs, setLogs] = useState([]);
  const [expandedLogIndex, setExpandedLogIndex] = useState(null);
  const navigate = useNavigate();
  const [medicineNames, setMedicineNames] = useState({});

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/logs/');
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      const data = await response.json();
      const sortedLogs = data.logs.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Fetch medicine names for each log
      const logsWithMedicineNames = await Promise.all(sortedLogs.map(async (log) => ({
        ...log,
        medicineNames: await Promise.all(log.medicine.map(fetchMedicineName))
      })));
      
      setLogs(logsWithMedicineNames);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const fetchMedicineName = async (guid) => {
    if (medicineNames[guid]) return medicineNames[guid];
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/medicine/${guid}/`);
      if (!response.ok) throw new Error('Failed to fetch medicine name');
      const data = await response.json();
      setMedicineNames(prev => ({ ...prev, [guid]: data.name }));
      return data.name;
    } catch (error) {
      console.error('Error fetching medicine name:', error);
      return guid;
    }
  };

  // Function to handle click to toggle expanded log
  const toggleLog = (index) => {
    setExpandedLogIndex(expandedLogIndex === index ? null : index);
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 0: return 'Mild';
      case 1: return 'Moderate';
      case 2: return 'Severe';
      default: return 'Unknown';
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case 0: return 'Low';
      case 1: return 'Medium';
      case 2: return 'High';
      default: return 'Unknown';
    }
  };

  // Function to export a single log to PDF
  const exportToPDF = (log) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Medication and Symptom Log', 105, 20, null, null, 'center');

    doc.setFontSize(16);
    doc.text(`Date: ${new Date(log.date).toLocaleDateString()}`, 20, 40);

    doc.setFontSize(14);
    doc.text('Medications:', 20, 50);
    log.medicineNames.forEach((med, idx) => {
      doc.text(`${idx + 1}. ${med}`, 30, 60 + idx * 10);
    });

    const symptomsStartY = 60 + log.medicineNames.length * 10 + 10;
    doc.setFontSize(14);
    doc.text('Symptoms:', 20, symptomsStartY);
    log.symptoms.forEach((sym, idx) => {
      doc.text(`${idx + 1}. ${sym[0]} (Severity: ${getSeverityText(sym[1])}, Urgency: ${getUrgencyText(sym[2])})`, 30, symptomsStartY + 10 + idx * 10);
    });

    doc.save(`Log_${new Date(log.date).toISOString().split('T')[0]}.pdf`);
  };

  // Function to export all logs to a single PDF
  const exportAllToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Medication and Symptom Log', 105, 20, null, null, 'center');
    let y = 40;

    logs.forEach((log) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(16);
      doc.text(`Date: ${new Date(log.date).toLocaleDateString()}`, 20, y);
      y += 10;

      doc.setFontSize(14);
      doc.text('Medications:', 20, y);
      y += 10;
      log.medicineNames.forEach((med, idx) => {
        doc.text(`${idx + 1}. ${med}`, 30, y);
        y += 10;
      });

      doc.setFontSize(14);
      doc.text('Symptoms:', 20, y);
      y += 10;
      log.symptoms.forEach((sym, idx) => {
        doc.text(`${idx + 1}. ${sym[0]} (Severity: ${getSeverityText(sym[1])}, Urgency: ${getUrgencyText(sym[2])})`, 30, y);
        y += 10;
      });

      y += 10;
    });

    doc.save('All_Logs.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-blue-200 to-green-200 p-6 text-white">
      <h2 className="text-3xl font-semibold text-center mb-6">Medication and Symptom Log</h2>
      <div className="flex flex-col space-y-4">
        {logs.map((log, index) => (
          <div 
            key={log.id} 
            className="bg-[#24698E] p-4 rounded-lg shadow-lg cursor-pointer" 
            onClick={() => toggleLog(index)}
          >
            <h3 className="text-xl font-semibold mb-2">{new Date(log.date).toLocaleDateString()}</h3>
            {expandedLogIndex === index && (
              <>
                <div>
                  <strong>Medications:</strong>
                  {log.medicineNames.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {log.medicineNames.map((medicineName, idx) => (
                        <li key={idx} className="text-white">{medicineName}</li>
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
                          {symptom[0]} (Severity: {getSeverityText(symptom[1])}, Urgency: {getUrgencyText(symptom[2])})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white">None</p>
                  )}
                </div>
                <button
                  onClick={(e) => { 
                    e.stopPropagation();
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
      <div className="mt-6">
        <button 
          onClick={exportAllToPDF} 
          className="bg-blue-500 hover:bg-black text-white font-semibold py-2 px-4 rounded shadow transition duration-200"
        >
          Export All Logs to PDF
        </button>
      </div>
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