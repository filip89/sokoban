import { useLayoutEffect, useRef, useState } from 'react';
import BlockGfx from '../components/BlockGfx';
import { Field } from '../models/Field';
import { MapTemplate } from '../models/MapTemplate';
import * as mapScanner from '../services/TemplateScanner';
import updateMovableElementPosition from '../services/updateMovableElementPosition';

function usePlayer(
    mapTemplate: MapTemplate,
    transitionEndHandler: () => void
): [Field, React.Dispatch<React.SetStateAction<Field>>, JSX.Element] {
    const [playerField, setPlayerField] = useState<Field>(() => mapScanner.getPlayerField(mapTemplate));
    const playerRef = useRef<HTMLDivElement>(null);
    const [playerKey, setPlayerKey] = useState(Math.random()); //used to change player element in dom and prevent animation when changing maps

    useLayoutEffect(() => {
        setPlayerKey(Math.random());
    }, [mapTemplate]);

    useLayoutEffect(() => {
        updateMovableElementPosition(playerRef.current!, playerField.coordinates)
    }, [playerField]);

    const playerElement: JSX.Element = (
        <div
            key={playerKey}
            ref={playerRef}
            className="movable-wrapper"
            onTransitionEnd={transitionEndHandler}
            style={{ zIndex: playerField.coordinates.y }}
        >
            <BlockGfx type="player"></BlockGfx>
        </div>
    );

    return [playerField, setPlayerField, playerElement];
}

export default usePlayer;
