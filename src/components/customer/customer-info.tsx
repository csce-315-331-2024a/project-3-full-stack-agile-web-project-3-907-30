import { useState, useEffect } from 'react';
import CustomerWeather from './customer-weather';
import { Weather } from '@/pages/api/customer/weather';

/**
 * Checks for changes in client-side storage and updates the state accordingly.
 * @example
 * checkForChange()
 * @returns {boolean} Returns true if there is a change in client-side storage, false otherwise.
 * @description
 *   - Checks if client-side window is defined before interacting with storage.
 *   - Defines variables for current and previous customer name and points.
 *   - Compares current and previous values and updates state if there is a change.
 *   - Runs every 0.1 seconds using an interval timer.
 */
const useLocalStorageChangeListener = () => {
  const [localStorageChange, updateLocalStorageChange] = useState(false);

  // Need to check if client side window is defined before interacting with client-side storage
  if (typeof window !== 'undefined') {
    localStorage.setItem('prevName', localStorage.getItem('customerName')!);
    localStorage.setItem('prevPoints', localStorage.getItem('customerPoints')!);
    localStorage.setItem('prevId', localStorage.getItem('customerId')!);
  }

  // Define checker function and register it with an interval timer when component mounts
  useEffect(() => {
    const checkForChange = () => {
      let currentName: string | null;
      let currentPoints: string | null;
      let currentId: string | null;
      let prevName: string | null;
      let prevPoints: string | null;
      let prevId: string | null;
      if (typeof window !== 'undefined') {
        currentName = localStorage.getItem('customerName');
        currentPoints = localStorage.getItem('customerPoints');
        currentId = localStorage.getItem('customerId');
        prevName = localStorage.getItem('prevName');
        prevPoints = localStorage.getItem('prevPoints');
        prevId = localStorage.getItem('prevId');
      }
      else {
        currentName = null;
        currentPoints = null;
        currentId = null;
        prevName = null;
        prevPoints = null;
        prevId = null;
      }
      if (currentName !== prevName && currentPoints !== prevPoints) {
        updateLocalStorageChange(prevState => !prevState);

        localStorage.setItem('prevName', currentName!);
        localStorage.setItem('prevPoints', currentPoints!);
        localStorage.setItem('prevId', currentId!);
      }
    }

    // Will run checkForChange every 0.1 sec
    const intervalId = setInterval(checkForChange, 100);

    return () => clearInterval(intervalId);

  }, []);

  return localStorageChange;
}

interface customerInfoProps {
  weather: Weather;
  children?: React.ReactNode;
}


/**
 * Displays a welcome message and customer points if signed in, or a message if no customer found.
 * @component
 * @example
 *   <CustomerPoints data={weather} />
 * @prop {Weather} data - Object containing weather information
 * @description
 *   - Uses local storage to check for customer name and points
 *   - Handles 'hydration' issue by only rendering after component has mounted
 *   - Renders different html based on customer name
 *   - If no customer found, displays a message
 */
const CustomerInfo = ({ weather = { value: 0, isDay: true, description: 'Clear' } as Weather, children }: customerInfoProps) => {
  const localStorageChange = useLocalStorageChangeListener();
  let customerName: string | null;
  let customerPoints: string | null;
  let customerId: string | null;

  // This fixes 'hydration' issue, where the client side has not loaded the component, but on the server side
  // the logic is already working; causing the renders to not match
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // When component mounts, set hydrated
    setHydrated(true);
  }, [])

  if (!hydrated) {
    // If component not mounted, return nothing
    return null;
  }

  if (typeof window !== 'undefined') {
    customerName = localStorage.getItem('customerName')!;
    customerPoints = localStorage.getItem('customerPoints')!;
    customerId = localStorage.getItem('customerId')!;
  }
  else {
    customerName = null;
    customerPoints = null;
    customerId = null;
  }

  return (
    // Render different html based on what customerName is
    <div className="flex flex-col lg:flex-row gap-2">
      <CustomerWeather data={weather}></CustomerWeather>
      <div className="flex flex-row justify-between items-center text-xs lg:text-base">
        {customerName === null && (
          <h1>Welcome! Sign-in to view your points.</h1>
          // <h1>{translatedText.welcome}</h1>
        )}
        {customerName === 'no customer' && (
          <h1>No customer found.</h1>
          // <h1>{translatedText.noCustomer}</h1>
        )}
        {customerName !== null && customerName !== 'no customer' && (
          <h1>Hey {customerName}! You have {customerPoints} points!</h1>
          // <h1>{translatedText.greeting}</h1>
        )}
      </div>
      {children}
    </div>
  );
}

export default CustomerInfo;