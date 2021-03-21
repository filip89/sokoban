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
        console.log('registering box elem');

        boxesRefs.current.push(elem);
    }

    function handleOnKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
        if (isAnimating) return;
        if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        let movement: Position = {
            row: 0,
            column: 0,
        };
        switch (event.key) {
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
        let targetPosition: Position = {
            row: playerPosition.row + movement.row,
            column: playerPosition.column + movement.column,
        };
        if (isTraversable(targetPosition)) {
            const boxInWay: Box | undefined = getBoxAtPosition(targetPosition);
            if (boxInWay) {
                const targetBoxPosition: Position = {
                    row: boxInWay.position.row + movement.row,
                    column: boxInWay.position.column + movement.column,
                };
                if (isTraversable(targetBoxPosition) && !getBoxAtPosition(targetBoxPosition)) {
                    const newBoxesState: Box[] = boxesState.map((box) => {
                        if (box.id === boxInWay.id) {
                            return {
                                ...box,
                                position: {
                                    row: box.position.row + movement.row,
                                    column: box.position.column + movement.column,
                                },
                            };
                        }
                        return box;
                    });
                    setPlayerPosition(targetPosition);
                    setIsAnimating(true);
                    setBoxesState(newBoxesState);
                }
            } else {
                setPlayerPosition(targetPosition);
                setIsAnimating(true);
            }
        }
    }

    function isTraversable(position: Position): boolean {
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
            <div ref={playerRef} className="player" onTransitionEnd={handleTransitionEnd}>
                P
            </div>
            {useMemo(
                () =>
                    boxesInitialData.map((box) => (
                        <div
                            ref={registerBoxRef}
                            className="box"
                            onTransitionEnd={handleTransitionEnd}
                            key={box.id}
                            data-box-id={box.id}
                        >
                            B
                        </div>
                    )),
                [boxesInitialData]
            )}
        </div>
    );
};

export default Game;
