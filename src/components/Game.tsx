import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import useInput from '../hooks/useInput';
import useLoop from '../hooks/useLoop';
import Box from '../models/Box';
import { Position } from '../models/Position';
import * as positionScanner from '../services/MapTemplateEntities';
import { getMovementFromInputKey } from '../services/InputService';
import './Game.scss';
import Map, { MapTemplate } from './Map';

export interface GameProps {
    mapTemplate: MapTemplate;
}

const Game: React.FC<GameProps> = ({ mapTemplate }) => {
    const [playerPosition, setPlayerPosition] = useState<Position>(positionScanner.getPlayerPosition(mapTemplate));
    const playerRef = useRef<HTMLDivElement>(null);
    const boxesInitialData: Box[] = useMemo<Box[]>(() => {
        return positionScanner.getBoxes(mapTemplate);
    }, [mapTemplate]);
    const [boxesState, setBoxesState] = useState<Box[]>(boxesInitialData);
    const boxesRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentInput, keyDownHandler, keyUpHandler] = useInput();

    useLoop(tryToMove, 10);

    useLayoutEffect(() => {
        updateElementPosition(playerRef.current!, playerPosition);
    }, [playerPosition]);

    useLayoutEffect(() => {
        boxesState.forEach((box) => {
            const boxElem = getBoxElement(box.id);
            if (boxElem) {
                updateElementPosition(boxElem, box.position);
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

    function updateElementPosition(elem: HTMLDivElement, position: Position): void {
        elem.style.left = `${position.column * 40}px`;
        elem.style.top = `${position.row * 40}px`;
    }

    useEffect(() => {
        setPlayerPosition(positionScanner.getPlayerPosition(mapTemplate));
        setBoxesState(positionScanner.getBoxes(mapTemplate));
    }, [mapTemplate]);

    function tryToMove(): void {
        if (isAnimating || !currentInput) return;
        const movement: Position = getMovementFromInputKey(currentInput);
        const targetPosition: Position = getPositionByMovement(playerPosition, movement);
        if (!positionIsTraversable(mapTemplate, targetPosition)) return;
        const boxInWay: Box | undefined = getBoxAtPosition(targetPosition);
        let playerCanMove: boolean = !boxInWay || tryToMoveBox(boxInWay, movement);
        if (playerCanMove) {
            setPlayerPosition(targetPosition);
            setIsAnimating(true);
        }
    }

    function tryToMoveBox(box: Box, direction: Position): boolean {
        const targetPosition: Position = getPositionByMovement(box.position, direction);
        let boxMoved: boolean = false;
        if (canMoveBoxTo(targetPosition)) {
            setBoxesState(generateNewBoxesState(box, targetPosition));
            boxMoved = true;
        }
        return boxMoved;
    }

    function generateNewBoxesState(boxToMove: Box, boxDestination: Position): Box[] {
        return boxesState.map((boxItem) => {
            if (boxItem.id === boxToMove.id) {
                return {
                    ...boxToMove,
                    position: boxDestination,
                };
            }
            return boxItem;
        });
    }

    function getBoxAtPosition({ row, column }: Position): Box | undefined {
        return boxesState.find((box) => box.position.row === row && box.position.column === column);
    }

    function canMoveBoxTo(position: Position): boolean {
        return positionIsTraversable(mapTemplate, position) && !getBoxAtPosition(position);
    }

    function getPositionByMovement(initialPosition: Position, movement: Position): Position {
        return {
            row: initialPosition.row + movement.row,
            column: initialPosition.column + movement.column,
        };
    }

    function positionIsTraversable(mapTemplate: MapTemplate, position: Position): boolean {
        let desiredRow: string[] = mapTemplate[position.row];
        let field: string | undefined = desiredRow && desiredRow[position.column];
        return !!field && ['g', 'd', 'b', 'p'].includes(field);
    }

    function handleTransitionEnd(): void {
        setIsAnimating(false);
    }

    return (
        <div tabIndex={-1} className="game" onKeyDown={keyDownHandler} onKeyUp={keyUpHandler}>
            <Map template={mapTemplate}></Map>
            <div ref={playerRef} className="player" onTransitionEnd={handleTransitionEnd}></div>
            {useMemo(
                () =>
                    boxesInitialData.map((box) => (
                        <div
                            ref={registerBoxRef}
                            className="box"
                            onTransitionEnd={handleTransitionEnd}
                            key={box.id}
                            data-box-id={box.id}
                        ></div>
                    )),
                [boxesInitialData]
            )}
        </div>
    );
};

export default Game;
