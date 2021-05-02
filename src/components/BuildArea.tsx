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
    const [lastPoint, setLastPoint] = useState<Coordinates>();

    function resetPoints(): void {
        setAnchorPoint(undefined);
        setLastPoint(undefined);
    }

    function handleMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>, coordinates: Coordinates): void {
        if (!selectedSign) return;
        if (event.button === 0) {
            setAnchorPoint(coordinates);
            setLastPoint(coordinates);
        } else if (event.button === 2) {
            resetPoints();
        }
    }

    function handleMouseEnter(point: Coordinates): void {
        if (anchorPoint) {
            setLastPoint(point);
        }
    }

    function handleMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        let points: Coordinates[] | undefined = getStartAndEndPoints();
        if (event.button === 0 && points) {
            onBuild(points[0], points[1]);
            resetPoints();
        }
    }

    function getStartAndEndPoints(): [Coordinates, Coordinates] | undefined {
        if (anchorPoint && lastPoint) {
            let startPoint: Coordinates = { x: 0, y: 0 };
            let endPoint: Coordinates = { x: 0, y: 0 };
            if (anchorPoint.x < lastPoint.x) {
                startPoint.x = anchorPoint.x;
                endPoint.x = lastPoint.x;
            } else {
                startPoint.x = lastPoint.x;
                endPoint.x = anchorPoint.x;
            }
            if (anchorPoint.y < lastPoint.y) {
                startPoint.y = anchorPoint.y;
                endPoint.y = lastPoint.y;
            } else {
                startPoint.y = lastPoint.y;
                endPoint.y = anchorPoint.y;
            }
            return [startPoint, endPoint];
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
        let points: Coordinates[] | undefined = getStartAndEndPoints();
        if (!points) return false;
        const [startPoint, endPoint] = points;
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
                                onMouseEnter={() => handleMouseEnter(location)}
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
