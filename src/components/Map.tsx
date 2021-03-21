import React from 'react';
import './Map.scss';

export type MapTemplate = string[][];

export interface MapProps {
    template: MapTemplate;
}

const Map: React.FC<MapProps> = React.memo(({ template }) => {
    return (
        <div className="map">
            {template.map((row, rowIndex) => (
                <div key={rowIndex} className="map__row">
                    {row.map((field, columnIndex) => (
                        <div className="map__field" key={columnIndex}>
                            {field === 'o' && 'o'}
                            {field === 'd' && 'd'}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
});

export default Map;
