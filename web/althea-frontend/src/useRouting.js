import { useNavigate } from 'react-router-dom';

export default function Redirect() {
    const navigate = useNavigate();

    const handleRedirect = (location) => {
        navigate(location); 
    };

    return (
        <button 
            onClick={() => handleRedirect('./Select')} 
            className="bg-[#24698E] hover:bg-black text-white font-semibold py-2 px-4 rounded shadow"
        >
            Get Started
        </button>
    );
}