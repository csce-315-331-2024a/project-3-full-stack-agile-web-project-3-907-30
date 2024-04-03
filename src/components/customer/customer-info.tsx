import { useState, useEffect } from 'react';

// Make function that periodically checks if localStorage has changed, and re-renders component if it has
const useLocalStorageChangeListener = () => {
    const [localStorageChange, updateLocalStorageChange] = useState(false);

    // Need to check if client side window is defined before interacting with client-side storage
    if(typeof window !== 'undefined') {
        localStorage.setItem('prevName', localStorage.getItem('customerName')!);
        localStorage.setItem('prevPoints', localStorage.getItem('customerPoints')!);
    }

    // Define checker function and register it with an interval timer when component mounts
    useEffect(() => {
        const checkForChange = () => {
            let currentName: string | null;
            let currentPoints: string | null;
            let prevName: string | null;
            let prevPoints: string | null;
            if(typeof window !== 'undefined'){
                currentName = localStorage.getItem('customerName');
                currentPoints = localStorage.getItem('customerPoints');
                prevName = localStorage.getItem('prevName');
                prevPoints = localStorage.getItem('prevPoints');
            }
            else {
                currentName = null;
                currentPoints = null;
                prevName = null;
                prevPoints = null;
            }
            if(currentName !== prevName && currentPoints !== prevPoints) {
                updateLocalStorageChange(prevState => !prevState);

                localStorage.setItem('prevName', currentName!);
                localStorage.setItem('prevPoints', currentPoints!);
            }
        }

        // Will run checkForChange every 0.1 sec
        const intervalId = setInterval(checkForChange,100);

        return () => clearInterval(intervalId);

    }, []);

    return localStorageChange;
  }

const CustomerInfo = () => {
    const localStorageChange = useLocalStorageChangeListener();
    let customerName: string | null;
    let customerPoints: string | null;

    // This fixes 'hydration' issue, where the client side has not loaded the component, but on the server side
    // the logic is already working; causing the renders to not match
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        // When component mounts, set hydrated
        setHydrated(true);
    },[])

    if(!hydrated){
        // If component not mounted, return nothing
        return null;
    }

    if(typeof window !== 'undefined'){
        customerName = localStorage.getItem('customerName')!;
        customerPoints = localStorage.getItem('customerPoints')!;
    }
    else {
        customerName = null;
        customerPoints = null;
    }

    return (
        // Render different html based on what customerName is
        <div>
            { customerName === null &&(
                <div className="flex flex-row justify-between items-center">
                    <h1>Sign in here &gt;</h1>
                </div>
            )}
            { customerName === 'no customer' && (
                <div className="flex flex-row justify-between items-center">
                    <h1>Sign in failed :{'('} </h1>
                </div>
            )}
            { customerName !== null && customerName !== 'no customer' &&(
                <div className="flex flex-row justify-between items-center">
                    <h1>Hey {customerName}!    You have {customerPoints} points!</h1>
                </div>
            )}
        </div>
    );
}

export default CustomerInfo;