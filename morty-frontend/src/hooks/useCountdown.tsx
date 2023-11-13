import React, { useState, useEffect } from 'react';

const useCountdown = (startDate: string) => {
    const [hoursLeft, setHoursLeft] = useState(0);

    useEffect(() => {
        const calculateHoursLeft = () => {
            const expirationTime = new Date(startDate);
            expirationTime.setHours(expirationTime.getHours() + 24);

            const currentTime = new Date().getTime();
            const timeDifference = expirationTime.getTime() - currentTime;

            // Calculate hours left
            const hours = Math.max(0, Math.floor(timeDifference / (1000 * 60 * 60)));

            setHoursLeft(hours);
        };

        const countdownInterval = setInterval(() => {
            calculateHoursLeft();
        }, 1000 * 60 * 60); // Update every hour

        // Initial calculation
        calculateHoursLeft();

        // Cleanup on unmount
        return () => clearInterval(countdownInterval);
    }, [startDate]);

    return hoursLeft;
};

const CountdownComponent = ({ startDate }: { startDate: any }) => {
    const hoursLeft = useCountdown(startDate);

    return (
        <div>
            <p>{hoursLeft} hours left</p>
            {/* You can render the countdown in your desired format */}
        </div>
    );
};

export default CountdownComponent;
