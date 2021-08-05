import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import BoxGfx from '../components/gfxs/BoxGfx';
import Box from '../models/Box';
import { Coordinates } from '../models/Coordinates';
import { MapTemplate } from '../models/MapTemplate';
import * as mapScanner from '../services/TemplateScanner';
import updateMovableElementPosition from '../services/updateMovableElementPosition';

function useBoxes(mapTemplate: MapTemplate): [Box[], React.Dispatch<React.SetStateAction<Box[]>>, JSX.Element[]] {
    const boxesInitialData: Box[] = useMemo<Box[]>(() => mapScanner.getBoxes(mapTemplate), [mapTemplate]);
    const [boxesState, setBoxesState] = useState<Box[]>(boxesInitialData);
    const boxesRefs = useRef<HTMLDivElement[]>([]);

    useLayoutEffect(() => {
        boxesState.forEach((box) => {
            const boxElem = getBoxElement(box.id);
            if (boxElem) {
                let position: Coordinates = box.location.coordinates;
                updateMovableElementPosition(boxElem, position);
                boxElem.style.zIndex = position.y.toString();
            }
        });
    }, [boxesState]);

    useEffect(() => {
        boxesRefs.current = boxesRefs.current.slice(0, boxesInitialData.length); //remove old boxes in latter indexes if any exist
    }, [boxesInitialData]);

    function getBoxElement(boxId: string): HTMLDivElement | null | undefined {
        return boxesRefs.current.find((boxElem) => {
            return boxElem?.dataset.boxId === boxId;
        });
    }

    function registerBoxRef(element: HTMLDivElement | null, index: number): void {
        if (element) {
            boxesRefs.current[index] = element;
        }
    }

    const boxesElements: JSX.Element[] = useMemo<JSX.Element[]>(() => {
        return boxesInitialData.map((box, index) => (
            <div
                className="movable-wrapper"
                ref={(element) => registerBoxRef(element, index)}
                key={box.id}
                data-box-id={box.id}
            >
                <BoxGfx></BoxGfx>
            </div>
        ));
    }, [boxesInitialData]);

    return [boxesState, setBoxesState, boxesElements];
}

export default useBoxes;
