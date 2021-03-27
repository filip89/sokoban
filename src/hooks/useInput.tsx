import { useState } from "react";

export type InputKey = 'ArrowUp' | 'ArrowRight' | 'ArrowDown' | 'ArrowLeft';
const inputKeys: string[] = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];


function useInput(): [InputKey | null, (event: React.KeyboardEvent<HTMLDivElement>) => void, (event: React.KeyboardEvent<HTMLDivElement>) => void] {
    const [primaryInput, setPrimaryInput] = useState<InputKey | null>(null);
    const [secondaryInput, setSecondaryInput] = useState<InputKey | null>(null);
    
    function handleOnKeyDown({ key }: React.KeyboardEvent<HTMLDivElement>): void {
        if (primaryInput === key || secondaryInput === key) return;
        if (!inputKeys.includes(key)) return;
        if (primaryInput) {
            setSecondaryInput(primaryInput);
        }
        setPrimaryInput(key as InputKey);
    }

    function handleOnKeyUp({ key }: React.KeyboardEvent<HTMLDivElement>): void {
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
    }

    return [primaryInput, handleOnKeyDown, handleOnKeyUp];
}

export default useInput;