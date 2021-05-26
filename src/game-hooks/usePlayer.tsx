import { useLayoutEffect, useRef, useState } from 'react';
import BlockGfx from '../components/BlockGfx';
import { Coordinates } from '../models/Coordinates';
import { Field } from '../models/Field';
import { MapTemplate } from '../models/MapTemplate';
import * as mapScanner from '../services/TemplateScanner';

function usePlayer(mapTemplate: MapTemplate, transitionEndHandler: () => void): [Field, React.Dispatch<React.SetStateAction<Field>>, React.RefObject<HTMLDivElement>, JSX.Element] {
    const [playerField, setPlayerField] = useState<Field>(() => mapScanner.getPlayerField(mapTemplate));
    const playerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        updateElementPosition(playerRef.current!, playerField.coordinates);
    }, [playerField]);

    function updateElementPosition(elem: HTMLDivElement, coordinates: Coordinates): void {
        elem.style.left = `${coordinates.x * 40}px`;
        elem.style.top = `${coordinates.y * 40}px`;
    }

    const playerElement: JSX.Element = (
        <div
            ref={playerRef}
            className="movable-wrapper"
            onTransitionEnd={transitionEndHandler}
            style={{ zIndex: playerField.coordinates.y }}
        >
            <BlockGfx type="player"></BlockGfx>
        </div>
    );

    return [playerField, setPlayerField, playerRef, playerElement];
}

export default usePlayer;