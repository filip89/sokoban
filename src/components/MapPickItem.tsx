import './MapPickItem.scss';
import MapComponent from './Map';
import { Map } from '../models/Map';
import { FaTrash } from 'react-icons/fa';

interface MapPickItemProps {
    map: Map;
    onMapDelete: (mapId: string) => void;
    isEditMode: boolean;
    selectedMapId?: string;
}

const MapPickItem: React.FC<MapPickItemProps> = ({map, onMapDelete, isEditMode}) => {

    function deleteMap(event: React.MouseEvent<SVGElement, MouseEvent>, mapId: string): void {
        event.stopPropagation();
        onMapDelete(mapId);
    }

    return (
        <div>
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
    );
};

export default MapPickItem;
