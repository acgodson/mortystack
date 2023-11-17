import { Box } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

const useCountdown = (startDate: string) => {
    const [hoursLeft, setHoursLeft] = useState(0);

    useEffect(() => {
        const calculateHoursLeft = () => {
            const expirationTime = new Date(startDate);
            expirationTime.setHours(expirationTime.getHours() + 24);
            const currentTime = new Date().getTime();
            const timeDifference = expirationTime.getTime() - currentTime;
            const hours = Math.max(0, Math.floor(timeDifference / (1000 * 60 * 60)));
            setHoursLeft(hours);
        };

        const countdownInterval = setInterval(() => {
            calculateHoursLeft();
        }, 1000 * 60 * 60);

        calculateHoursLeft();

        return () => clearInterval(countdownInterval);
    }, [startDate]);

    return hoursLeft;
};

const CountdownComponent = ({ startDate }: { startDate: any }) => {
    const hoursLeft = useCountdown(startDate);

    return (
        <Box>
            <p>{hoursLeft} hours left to expire</p>
        </Box>
    );
};

export default CountdownComponent;
