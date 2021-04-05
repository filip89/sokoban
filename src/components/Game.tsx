import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import useInput from '../hooks/useInput';
import useLoop from '../hooks/useLoop';
import Box from '../models/Box';
import { Coordinates } from '../models/Coordinates';
import * as mapScanner from '../services/MapTemplateScanner';
import { getDirectionFromInputKey } from '../services/InputService';
import './Game.scss';
import Map from './Map';
import BlockGfx from './BlockGfx';
import { BiReset } from 'react-icons/bi';
import { Field } from '../models/Field';
import { MapTemplate } from '../models/MapTemplate';

export interface GameProps {
    mapTemplate: MapTemplate;
}

const Game: React.FC<GameProps> = ({ mapTemplate }) => {
    const [playerLocation, setPlayerLocation] = useState<Field>(mapScanner.getPlayerLocation(mapTemplate));
    const playerRef = useRef<HTMLDivElement>(null);
    const boxesInitialData: Box[] = useMemo<Box[]>(() => {
        return mapScanner.getBoxes(mapTemplate);
    }, [mapTemplate]);
    const [boxesState, setBoxesState] = useState<Box[]>(boxesInitialData);
    const boxesRefs = useRef<HTMLDivElement[]>([]);
    const destinationLocations: Field[] = useMemo<Field[]>(() => {
        return mapScanner.getDestinationLocations(mapTemplate);
    }, [mapTemplate]);
    const [currentInput, keyDownHandler, keyUpHandler] = useInput();
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

    useLayoutEffect(() => {
        updateElementPosition(playerRef.current!, playerLocation.coordinates);
    }, [playerLocation]);

    useLayoutEffect(() => {
        boxesState.forEach((box) => {
            const boxElem = getBoxElement(box.id);
            if (boxElem) {
                let position: Coordinates = box.location.coordinates;
                updateElementPosition(boxElem, position);
                boxElem.style.zIndex = position.y.toString();
            }
        });
    }, [boxesState]);

    function registerBoxRef(elem: HTMLDivElement): void {
        boxesRefs.current.push(elem);
    }

    function getBoxElement(boxId: string): HTMLDivElement | null | undefined {
        return boxesRefs.current.find((boxElem) => {
            return boxElem?.dataset.boxId === boxId;
        });
    }

    function updateElementPosition(elem: HTMLDivElement, coordinates: Coordinates): void {
        elem.style.left = `${coordinates.x * 40}px`;
        elem.style.top = `${coordinates.y * 40}px`;
    }

    const reset = useCallback(() => {
        playerRef.current && disableElementAnimationForTick(playerRef.current);
        boxesRefs.current.forEach((boxElem) => disableElementAnimationForTick(boxElem));
        setPlayerLocation(mapScanner.getPlayerLocation(mapTemplate));
        setBoxesState(mapScanner.getBoxes(mapTemplate));
        setCompleted(false);
    }, [mapTemplate]);

    useEffect(() => {
        reset();
    }, [reset]);

    function disableElementAnimationForTick(elem: HTMLDivElement): void {
        elem?.classList.add('movable-wrapper--no-transition');
        setTimeout(() => {
            elem?.classList.remove('movable-wrapper--no-transition');
        });
    }

    function tryToMove(): void {
        if (isAnimating || !currentInput || completed) return;
        const direction: Coordinates = getDirectionFromInputKey(currentInput);
        const targetField: Field = playerLocation.getAdjacentField(direction);
        if (!mapScanner.isTraversable(mapTemplate, targetField.coordinates)) return;
        const boxInWay: Box | undefined = getBoxAtField(targetField);
        let playerCanMove: boolean = !boxInWay || tryToMoveBox(boxInWay, direction);
        if (playerCanMove) {
            setPlayerLocation(targetField);
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

    const playerElement: JSX.Element = (
        <div
            ref={playerRef}
            className="movable-wrapper"
            onTransitionEnd={handleTransitionEnd}
            style={{ zIndex: playerLocation.coordinates.y }}
        >
            <BlockGfx type="player"></BlockGfx>
        </div>
    );

    const boxesElements: JSX.Element[] = useMemo<JSX.Element[]>(() => {
        return boxesInitialData.map((box) => (
            <div className="movable-wrapper" ref={registerBoxRef} key={box.id} data-box-id={box.id}>
                <BlockGfx type="box"></BlockGfx>
            </div>
        ));
    }, [boxesInitialData]);

    return (
        <div className="game-wrapper">
            <div>
                <div className="game-status">
                    <div>Boxes left: {boxesLeft}</div>
                    <button className="reset-btn" onClick={reset}>
                        <BiReset size="22" />
                    </button>
                </div>
                <div tabIndex={-1} className="game" onKeyDown={keyDownHandler} onKeyUp={keyUpHandler}>
                    <Map template={mapTemplate}></Map>
                    {playerElement}
                    {boxesElements}
                </div>
            </div>
        </div>
    );
};

export default Game;
