import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Box from '../models/Box';
import { Position } from '../models/Position';
import * as mapExtractor from '../services/MapExtractor';
import './Game.scss';
import Map, { MapTemplate } from './Map';

export interface GameProps {
    mapTemplate: MapTemplate;
}

const Game: React.FC<GameProps> = ({ mapTemplate }) => {
    const boxesInitialData: Box[] = useMemo<Box[]>(() => {
        return mapExtractor.getBoxes(mapTemplate);
    }, [mapTemplate]);
    const [playerPosition, setPlayerPosition] = useState<Position>(mapExtractor.getPlayerPosition(mapTemplate));
    const playerRef = useRef<HTMLDivElement>(null);
    const [boxesState, setBoxesState] = useState<Box[]>(boxesInitialData);
    const boxesRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setPlayerPosition(mapExtractor.getPlayerPosition(mapTemplate));
        setBoxesState(mapExtractor.getBoxes(mapTemplate));
    }, [mapTemplate]);

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

    function getBoxElement(boxId: string): HTMLDivElement | null | undefined {
        return boxesRefs.current.find((boxElem) => {
            return boxElem?.dataset.boxId === boxId;
        });
    }

    function updateElementPosition(elem: HTMLDivElement, position: Position): void {
        elem.style.left = `${position.column * 40}px`;
        elem.style.top = `${position.row * 40}px`;
    }

    function registerBoxRef(elem: HTMLDivElement): void {
        boxesRefs.current.push(elem);
    }

    function handleOnKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
        if (isAnimating) return;
        if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        const movement: Position = getMovementFromInputKey(event.key);
        const targetPosition: Position = getPositionByMovement(playerPosition, movement);
        if (!positionIsTraversable(targetPosition)) return;
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
        if (positionIsTraversable(targetPosition) && !getBoxAtPosition(targetPosition)) {
            const newBoxesState: Box[] = boxesState.map((boxItem) => {
                if (boxItem.id === box.id) {
                    return {
                        ...box,
                        position: targetPosition,
                    };
                }
                return boxItem;
            });
            setBoxesState(newBoxesState);
            boxMoved = true;
        }
        return boxMoved;
    }

    function getMovementFromInputKey(inputKey: string): Position {
        const movement: Position = {
            row: 0,
            column: 0,
        };
        switch (inputKey) {
            case 'ArrowRight':
                movement.column++;
                break;
            case 'ArrowLeft':
                movement.column--;
                break;
            case 'ArrowUp':
                movement.row--;
                break;
            case 'ArrowDown':
                movement.row++;
                break;
        }
        return movement;
    }

    function getPositionByMovement(initialPosition: Position, movement: Position): Position {
        return {
            row: initialPosition.row + movement.row,
            column: initialPosition.column + movement.column,
        };
    }

    function positionIsTraversable(position: Position): boolean {
        let desiredRow: string[] = mapTemplate[position.row];
        let field: string | undefined = desiredRow && desiredRow[position.column];
        return ['g', 'd', 'b', 'p'].includes(field);
    }

    function getBoxAtPosition({ row, column }: Position): Box | undefined {
        return boxesState.find((box) => box.position.row === row && box.position.column === column);
    }

    function handleTransitionEnd(): void {
        setIsAnimating(false);
    }

    return (
        <div tabIndex={-1} className="game" onKeyDown={handleOnKeyDown}>
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
