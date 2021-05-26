import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import BlockGfx from '../components/BlockGfx';
import Box from '../models/Box';
import { Coordinates } from '../models/Coordinates';
import { MapTemplate } from '../models/MapTemplate';
import * as mapScanner from '../services/TemplateScanner';

function useBoxes(
    mapTemplate: MapTemplate
): [Box[], React.Dispatch<React.SetStateAction<Box[]>>, React.MutableRefObject<HTMLDivElement[]>, JSX.Element[]] {
    const boxesInitialData: Box[] = useMemo<Box[]>(() => mapScanner.getBoxes(mapTemplate), [mapTemplate]);
    const [boxesState, setBoxesState] = useState<Box[]>(boxesInitialData);
    const boxesRefs = useRef<HTMLDivElement[]>([]);

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

    function getBoxElement(boxId: string): HTMLDivElement | null | undefined {
        return boxesRefs.current.find((boxElem) => {
            return boxElem?.dataset.boxId === boxId;
        });
    }

    function updateElementPosition(elem: HTMLDivElement, coordinates: Coordinates): void {
        elem.style.left = `${coordinates.x * 40}px`;
        elem.style.top = `${coordinates.y * 40}px`;
    }

    useEffect(() => {
        boxesRefs.current = boxesRefs.current.slice(0, boxesInitialData.length);
    }, [boxesInitialData]);

    const boxesElements: JSX.Element[] = useMemo<JSX.Element[]>(() => {
        return boxesInitialData.map((box, index) => (
            <div
                className="movable-wrapper"
                ref={(element) => registerBoxRef(element, index)}
                key={box.id}
                data-box-id={box.id}
            >
                <BlockGfx type="box"></BlockGfx>
            </div>
        ));
    }, [boxesInitialData]);

    function registerBoxRef(element: HTMLDivElement | null, index: number): void {
        if (element) {
            boxesRefs.current[index] = element;
        }
    }

    return [boxesState, setBoxesState, boxesRefs, boxesElements];
}

export default useBoxes;
