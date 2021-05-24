import { useCallback, useEffect, useState } from 'react';

export type InputKey = 'ArrowUp' | 'ArrowRight' | 'ArrowDown' | 'ArrowLeft';
const inputKeys: string[] = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];

function useInput(): InputKey | null {
    const [primaryInput, setPrimaryInput] = useState<InputKey | null>(null);
    const [secondaryInput, setSecondaryInput] = useState<InputKey | null>(null);

    const keyDownHandler = useCallback(
        ({ key }: KeyboardEvent): void => {
            if (primaryInput === key || secondaryInput === key) return;
            if (!inputKeys.includes(key)) return;
            if (primaryInput) {
                setSecondaryInput(primaryInput);
            }
            setPrimaryInput(key as InputKey);
        },
        [primaryInput, secondaryInput]
    );

    const keyUpHandler = useCallback(
        ({ key }: KeyboardEvent): void => {
            if (primaryInput === key) {
                if (secondaryInput) {
                    setPrimaryInput(secondaryInput);
                    setSecondaryInput(null);
                } else {
                    setPrimaryInput(null);
                }
            } else if (secondaryInput === key) {
                setSecondaryInput(null);
            }
        },
        [primaryInput, secondaryInput]
    );

    useEffect(() => {
        document.addEventListener<'keydown'>('keydown', keyDownHandler);
        document.addEventListener<'keyup'>('keyup', keyUpHandler);
        return () => {
            document.removeEventListener<'keydown'>('keydown', keyDownHandler);
            document.removeEventListener<'keyup'>('keyup', keyUpHandler);
        };
    }, [keyDownHandler, keyUpHandler]);

    return primaryInput;
}

export default useInput;
