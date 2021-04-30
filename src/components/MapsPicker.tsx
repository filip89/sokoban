import './MapsPicker.scss';
import { Map } from '../models/Map';
import { FaTrash } from 'react-icons/fa';
import MapComponent from './Map';

export interface MapsPickerProps {
    maps: Map[];
    isEditMode: boolean;
    selectedMapId?: string;
    onMapSelect: (map: Map) => void;
    onMapDelete: (mapId: string) => void;
}

const MapsPicker: React.FC<MapsPickerProps> = ({ maps, isEditMode, selectedMapId, onMapSelect, onMapDelete }) => {
    function deleteMap(event: React.MouseEvent<SVGElement, MouseEvent>, mapId: string): void {
        event.stopPropagation();
        onMapDelete(mapId);
    }

    return (
        <div className="maps-container">
            {maps.map((map) => (
                <div
                    className={'maps-container__map map-item' + (map.id === selectedMapId ? ' map-item--selected' : '')}
                    key={map.id}
                    onClick={() => onMapSelect(map)}
                >
                    <div className="map-item__map">
                        <MapComponent template={map.trimmedTemplate} displayMovables={true}></MapComponent>
                    </div>
                    {isEditMode && (
                        <FaTrash
                            role="button"
                            className="map-item__delete"
                            onClick={(event) => deleteMap(event, map.id)}
                        ></FaTrash>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MapsPicker;
