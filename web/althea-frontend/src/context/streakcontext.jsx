import React, { createContext, useContext, useState } from 'react';

const streakContext = createContext();

export const useStreak = () => {
  return useContext(streakContext);
};

export const StreakProvider = ({ children }) => {
  const [streak, setStreak] = useState(0);
  const [lastCheckDate, setLastCheckDate] = useState(null);

  const updateStreak = () => {
    const currentDate = new Date();
    const today = currentDate.toDateString();
    
    // If lastCheckDate is today, do not increase the streak
    if (lastCheckDate === today) return;

    // Logic to check the difference between lastCheckDate and today
    if (lastCheckDate) {
      const lastDate = new Date(lastCheckDate);
      const diffTime = currentDate - lastDate; // difference in milliseconds
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert milliseconds to days
      
      if (diffDays > 1) {
        // Reset streak if the user missed more than one day ;(
        setStreak(0);
      } else {
        // Increment streak if the user checked in yesterday
        setStreak((prev) => prev + 1);
      }
    } else {
      // If it's first check start the streak at 1
      setStreak(1);
    }

    // Update the last check date to today
    setLastCheckDate(today);
  };

  return (
    <streakContext.Provider value={{ streak, updateStreak }}>
      {children}
    </streakContext.Provider>
  );
};
