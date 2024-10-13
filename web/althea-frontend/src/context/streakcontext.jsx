import React, { createContext, useContext, useState } from 'react';

// Create a context for the streak
const StreakContext = createContext();

// Custom hook to use the streak context
export const useStreak = () => {
  return useContext(StreakContext);
};

// Provider component to manage streak state
export const StreakProvider = ({ children }) => {
  const [streak, setStreak] = useState(0); // Current streak count
  const [lastCheckDate, setLastCheckDate] = useState(null); // Last check-in date

  const updateStreak = () => {
    const currentDate = new Date();
    const today = currentDate.toDateString(); // Get today's date as a string

    // Prevent incrementing the streak if the user has checked in today
    if (lastCheckDate === today) return;

    // Logic to check the difference between lastCheckDate and today
    if (lastCheckDate) {
      const lastDate = new Date(lastCheckDate);
      const diffTime = currentDate - lastDate; // Difference in milliseconds
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

      // Reset streak if the user missed more than one day
      if (diffDays > 1) {
        setStreak(0);
      } else {
        // Increment streak if the user checked in yesterday
        setStreak((prev) => prev + 1);
      }
    } else {
      // Start the streak at 1 if it's the first check-in
      setStreak(1);
    }

    // Update the last check date to today
    setLastCheckDate(today);
  };

  return (
    <StreakContext.Provider value={{ streak, updateStreak }}>
      {children}
    </StreakContext.Provider>
  );
};
