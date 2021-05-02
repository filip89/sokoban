import './BuildArea.scss';
import { Coordinates } from '../models/Coordinates';
import { MapFieldSign, MapTemplate } from '../models/MapTemplate';
import FieldGfx from './FieldGfx';
import React, { useState } from 'react';

const MemoizedFieldGfx = React.memo(FieldGfx);

export interface BuildAreaProps {
    mapTemplate: MapTemplate;
    selectedSign?: MapFieldSign;
    onBuild: (startPoint: Coordinates, endPoint: Coordinates) => void;
}

const BuildArea: React.FC<BuildAreaProps> = ({ mapTemplate, selectedSign, onBuild }) => {
    const [anchorPoint, setAnchorPoint] = useState<Coordinates>();
    const [startPoint, setStartPoint] = useState<Coordinates>();
    const [endPoint, setEndPoint] = useState<Coordinates>();

    function resetPoints(): void {
        setAnchorPoint(undefined);
        setStartPoint(undefined);
        setEndPoint(undefined);
    }

    function handleMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>, coordinates: Coordinates): void {
        if (!selectedSign) return;
        if (event.button === 0) {
            setAnchorPoint(coordinates);
            setStartPoint(coordinates);
            setEndPoint(coordinates);
        } else if (event.button === 2) {
            resetPoints();
        }
    }

    function handleMouseEnter(point: Coordinates): void {
        if (anchorPoint && startPoint && endPoint) {
            let startPointCopy: Coordinates = { ...startPoint };
            let endPointCopy: Coordinates = { ...endPoint };
            if (anchorPoint.x < point.x) {
                startPointCopy.x = anchorPoint.x;
                endPointCopy.x = point.x;
            } else {
                startPointCopy.x = point.x;
                endPointCopy.x = anchorPoint.x;
            }
            if (anchorPoint.y < point.y) {
                startPointCopy.y = anchorPoint.y;
                endPointCopy.y = point.y;
            } else {
                startPointCopy.y = point.y;
                endPointCopy.y = anchorPoint.y;
            }
            setStartPoint(startPointCopy);
            setEndPoint(endPointCopy);
        }
    }

    function handleMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        if (event.button === 0 && startPoint && endPoint) {
            onBuild(startPoint, endPoint);
            resetPoints();
        }
    }

    function handleFieldContextMenu(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        event.preventDefault();
    }

    function handleMouseLeave(): void {
        if (anchorPoint) {
            resetPoints();
        }
    }

    function fieldIsSelected(point: Coordinates): boolean {
        if (!startPoint || !endPoint) return false;
        const isBetweenColumns: boolean = point.y >= startPoint.y && point.y <= endPoint.y;
        const isBetweenRows: boolean = point.x >= startPoint.x && point.x <= endPoint.x;
        return isBetweenColumns && isBetweenRows;
    }

    function getFieldSign(currentSign: MapFieldSign, location: Coordinates): MapFieldSign {
        return selectedSign && fieldIsSelected(location) ? selectedSign : currentSign;
    }

    return (
        <div className="build-area" onMouseLeave={handleMouseLeave}>
            {mapTemplate.map((row, rowIndex) => (
                <div className="build-area__row" key={rowIndex}>
                    {row.map((fieldSign, columnIndex) => {
                        const location: Coordinates = { x: columnIndex, y: rowIndex };
                        return (
                            <div
                                className="build-area__field-slot"
                                key={columnIndex}
                                onContextMenu={(e) => handleFieldContextMenu(e)}
                                onMouseDown={(e) => handleMouseDown(e, location)}
                                onMouseEnter={(e) => handleMouseEnter(location)}
                                onMouseUp={(e) => handleMouseUp(e)}
                            >
                                <MemoizedFieldGfx sign={getFieldSign(fieldSign, location)}></MemoizedFieldGfx>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default BuildArea;
