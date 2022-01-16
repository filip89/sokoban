import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import useInput from '../game-hooks/useInput';
import useLoop from '../game-hooks/useLoop';
import Box from '../models/Box';
import { Coordinates } from '../models/Coordinates';
import * as mapScanner from '../services/TemplateScanner';
import { getDirectionFromInputKey } from '../services/InputService';
import './Game.scss';
import Map from './Map';
import { BiReset } from 'react-icons/bi';
import { Field } from '../models/Field';
import { MapTemplate } from '../models/MapTemplate';
import useBoxes from '../game-hooks/useBoxes';
import usePlayer from '../game-hooks/usePlayer';

export interface GameProps {
    mapTemplate: MapTemplate;
}

const Game: React.FC<GameProps> = ({ mapTemplate }) => {
    const [playerField, setPlayerField, playerElement] = usePlayer(mapTemplate, handleTransitionEnd);
    const [boxesState, setBoxesState, boxesElements] = useBoxes(mapTemplate);
    const destinationLocations: Field[] = useMemo<Field[]>(
        () => mapScanner.getDestinationLocations(mapTemplate),
        [mapTemplate]
    );
    const currentInput = useInput();
    const [isAnimating, setIsAnimating] = useState(false);
    const [completed, setCompleted] = useState<boolean>(false);

    const boxesLeft: number = useMemo(() => {
        return boxesState.reduce<number>((count, box) => {
            let boxAtDestination: boolean = !!destinationLocations.find(
                (destination) => destination.id === box.location.id
            );
            if (!boxAtDestination) count++;
            return count;
        }, 0);
    }, [boxesState, destinationLocations]);

    useLoop(tryToMove, 10);

    const reset = useCallback(() => {
        setPlayerField(mapScanner.getPlayerField(mapTemplate));
        setBoxesState(mapScanner.getBoxes(mapTemplate));
        setCompleted(false);
    }, [mapTemplate, setBoxesState, setPlayerField]); //only mapTemplate really necessary, but others show warning (since from custom hooks)

    useLayoutEffect(() => {
        reset();
    }, [mapTemplate, reset]);

    function tryToMove(): void {
        if (isAnimating || !currentInput || completed) return;
        const direction: Coordinates = getDirectionFromInputKey(currentInput);
        const targetField: Field = playerField.getAdjacentField(direction);
        if (!mapScanner.isTraversable(mapTemplate, targetField.coordinates)) return;
        const boxInWay: Box | undefined = getBoxAtField(targetField);
        let playerCanMove: boolean = !boxInWay || tryToMoveBox(boxInWay, direction);
        if (playerCanMove) {
            setPlayerField(targetField);
            setIsAnimating(true);
        }
    }

    function tryToMoveBox(box: Box, direction: Coordinates): boolean {
        const targetField: Field = box.location.getAdjacentField(direction);
        let boxMoved: boolean = false;
        if (mapScanner.isTraversable(mapTemplate, targetField.coordinates) && !getBoxAtField(targetField)) {
            setBoxesState(generateNewBoxesState(box, targetField.coordinates));
            boxMoved = true;
        }
        return boxMoved;
    }

    function generateNewBoxesState(boxToMove: Box, boxNewCoordinates: Coordinates): Box[] {
        return boxesState.map<Box>((boxItem) => {
            if (boxItem.id !== boxToMove.id) return boxItem;
            return {
                id: boxToMove.id,
                location: new Field(boxNewCoordinates),
            };
        });
    }

    function getBoxAtField(field: Field): Box | undefined {
        return boxesState.find((box) => box.location.id === field.id);
    }

    function handleTransitionEnd(): void {
        setIsAnimating(false);
        setIfCompleted();
    }

    function setIfCompleted(): void {
        let undeliveredBox: Box | undefined = boxesState.find(
            (box) => !destinationLocations.find((destinationLocation) => destinationLocation.id === box.location.id)
        );

        if (!undeliveredBox) {
            setCompleted(true);
        }
    }

    return (
        <div className="game">
            <div className="game__status">
                <button className="reset-btn" onClick={reset}>
                    <BiReset size="22" />
                </button>
                <div>Boxes left: {boxesLeft}</div>
            </div>
            <div className="game__game-map">
                <div className="game-map">
                    <Map template={mapTemplate}></Map>
                    {playerElement}
                    {boxesElements}
                </div>
            </div>
        </div>
    );
};

export default Game;
