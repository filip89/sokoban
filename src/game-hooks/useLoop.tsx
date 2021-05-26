import {useEffect, useRef} from 'react';

function useLoop(callback: () => any, delay: number): void {
    const callbackRef = useRef<() => any>(callback);

    useEffect(() => {
        callbackRef.current = callback;
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => callbackRef.current(), delay);
        return () => clearTimeout(timeoutId);
    });
}

export default useLoop;
