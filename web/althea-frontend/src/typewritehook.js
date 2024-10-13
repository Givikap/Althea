// useTypewriter.js
import { useEffect, useState } from 'react';

const useTypewriter = (text, speed) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      // Check if index is within bounds
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval); // Clear interval if done
      }
    }, speed);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [text, speed]);

  return displayedText;
};

export default useTypewriter;
