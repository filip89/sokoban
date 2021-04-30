import './TopMenu.scss';
import { Map } from '../models/Map';
import { FaTrash } from 'react-icons/fa';
import MapComponent from './Map';

export interface TopMenuProps {
    isEditMode: boolean;
    maps: Map[];
    selectedMapId?: string;
    onToggleMode: () => void;
    onMapSelect: (map: Map) => void;
    onMapAdd: () => void;
    onMapDelete: (mapId: string) => void;
}

const TopMenu: React.FC<TopMenuProps> = ({
    isEditMode,
    maps,
    selectedMapId,
    onMapSelect,
    onToggleMode,
    onMapAdd,
    onMapDelete,
}) => {
    function deleteMap(event: React.MouseEvent<SVGElement, MouseEvent>, mapId: string): void {
        event.stopPropagation();
        onMapDelete(mapId);
    }

    return (
        <div className="top-menu">
            <button className="top-menu__button" onClick={onToggleMode}>
                {isEditMode ? 'PLAY' : 'EDIT'}
            </button>
            <div className="top-menu__maps maps-container">
                {maps.map((map) => (
                    <div
                        className={
                            'maps-container__map map-item' + (map.id === selectedMapId ? ' map-item--selected' : '')
                        }
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
            {isEditMode && (
                <button className="top-menu__button" onClick={onMapAdd}>
                    ADD MAP
                </button>
            )}
        </div>
    );
};

export default TopMenu;
