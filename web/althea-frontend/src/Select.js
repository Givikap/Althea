import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Select() {
  const navigate = useNavigate();
  
  // State to hold drugs information
  const [drugs, setDrugs] = useState([]);
  const [add, setAdd] = useState(0);

  const handleContinue = async () => {
    // Filter out any empty drug entries
    const validDrugs = drugs.filter(drug => drug.value.trim() !== '');

    // Create medicines in the backend
    for (const drug of validDrugs) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/medicine/create/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: drug.value.trim() }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Medicine created: ${data.id}`);
      } catch (error) {
        console.error(`Error creating medicine: ${drug.value}`, error);
        // You might want to handle this error, perhaps by showing a message to the user
      }
    }

    // After creating all medicines, navigate to the daily checks page
    navigate('/check');
  };

  const addTo = () => {
    if (add < 10) {
      // Add a new input field with an empty value
      setDrugs([...drugs, { id: add, value: '' }]);
      setAdd(add + 1);
    }
  };

  const subTo = () => {
    if (add > 0) {
      // Remove the last input field
      setDrugs(drugs.slice(0, -1));
      setAdd(add - 1);
    }
  };

  // Handle the change of input value in the dynamic inputs
  const handleInputChange = (index, e) => {
    const updatedDrugs = [...drugs];
    updatedDrugs[index].value = e.target.value;
    setDrugs(updatedDrugs);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-blue-200 to-green-200 text-white flex justify-center items-center">
      <div className="flex flex-col justify-center items-start px-6">
        <header className="text-4xl font-bold text-center mb-6">
          What Drugs do You Normally Take, {localStorage.getItem('inputName')}?
        </header>
        <p className="text-white font-bold mb-4">lorem ipsum foo bar</p>

        {/* Buttons container */}
        <div className="flex space-x-4 mb-4">
          <button
            className="bg-white text-[#3D9991] font-bold py-2 px-4 rounded transition duration-300 hover:bg-purple-500 hover:text-black shadow-lg"
            onClick={addTo}
          >
            +
          </button>
          <button
            className="bg-purple-500 text-black font-bold py-2 px-4 rounded transition duration-300 hover:bg-white hover:text-purple-500 shadow-lg"
            onClick={subTo}
          >
            -
          </button>
        </div>

        <button
          onClick={handleContinue}
          className="mt-4 bg-[#24698E] hover:bg-[#000000] text-white font-semibold py-2 px-4 border border-green-700 rounded shadow transition duration-200"
        >
          Continue
        </button>
      </div>

      <div className="flex flex-col items-end px-6">
        {drugs.map((drug, index) => (
          <div key={index} className="mt-4">
            <input
              type="text"
              placeholder="Enter your drug"
              value={drug.value}
              onChange={(e) => handleInputChange(index, e)}
              className="p-2 rounded border border-gray-300 w-full text-black"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Select;
