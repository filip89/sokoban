import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import useInput from '../hooks/useInput';
import useLoop from '../hooks/useLoop';
import Box from '../models/Box';
import { Position } from '../models/Position';
import * as mapScanner from '../services/MapTemplateScanner';
import { getMovementFromInputKey } from '../services/InputService';
import './Game.scss';
import Map, { MapTemplate } from './Map';
import BlockGfx from './BlockGfx';
import { BiReset } from 'react-icons/bi';

export interface GameProps {
    mapTemplate: MapTemplate;
}

const Game: React.FC<GameProps> = ({ mapTemplate }) => {
    const [playerPosition, setPlayerPosition] = useState<Position>(mapScanner.getPlayerPosition(mapTemplate));
    const playerRef = useRef<HTMLDivElement>(null);
    const boxesInitialData: Box[] = useMemo<Box[]>(() => {
        return mapScanner.getBoxes(mapTemplate);
    }, [mapTemplate]);
    const [boxesState, setBoxesState] = useState<Box[]>(boxesInitialData);
    const boxesRefs = useRef<HTMLDivElement[]>([]);
    const destinations: Position[] = useMemo<Position[]>(() => {
        return mapScanner.getDestinations(mapTemplate);
    }, [mapTemplate]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentInput, keyDownHandler, keyUpHandler] = useInput();
    const [completed, setCompleted] = useState<boolean>(false);

    const boxesLeft: number = useMemo(() => {
        return boxesState.reduce<number>((count, box) => {
            let boxAtDestination: boolean = !!destinations.find((destination) => {
                return destination.row === box.position.row && destination.column === box.position.column;
            });
            if (!boxAtDestination) count++;
            return count;
        }, 0);
    }, [boxesState, destinations]);

    useLoop(tryToMove, 10);

    useLayoutEffect(() => {
        updateElementPosition(playerRef.current!, playerPosition);
    }, [playerPosition]);

    useLayoutEffect(() => {
        boxesState.forEach((box) => {
            const boxElem = getBoxElement(box.id);
            if (boxElem) {
                let position: Position = box.position;
                updateElementPosition(boxElem, position);
                boxElem.style.zIndex = position.row.toString();
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

    const reset = useCallback(() => {
        playerRef.current && disableElemAnimationForTick(playerRef.current);
        boxesRefs.current.forEach((boxElem) => disableElemAnimationForTick(boxElem));
        setPlayerPosition(mapScanner.getPlayerPosition(mapTemplate));
        setBoxesState(mapScanner.getBoxes(mapTemplate));
        setCompleted(false);
    }, [mapTemplate]);

    useEffect(() => {
        reset();
    }, [reset]);

    function disableElemAnimationForTick(elem: HTMLDivElement): void {
        elem?.classList.add('movable-wrapper--no-transition');
        setTimeout(() => {
            elem?.classList.remove('movable-wrapper--no-transition');
        });
    }

    function tryToMove(): void {
        if (isAnimating || !currentInput || completed) return;
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
        setIfCompleted();
    }

    function setIfCompleted(): void {
        let undeliveredBox: Box | undefined = boxesState.find((box) => {
            let notDelivered: boolean = !destinations.find((destination) => {
                return destination.row === box.position.row && destination.column === box.position.column;
            });
            return notDelivered;
        });

        if (!undeliveredBox) {
            setCompleted(true);
        }
    }

    const playerElement: JSX.Element = (
        <div
            ref={playerRef}
            className="movable-wrapper"
            onTransitionEnd={handleTransitionEnd}
            style={{ zIndex: playerPosition.row }}
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
