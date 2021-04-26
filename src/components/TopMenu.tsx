import './TopMenu.scss';
import { Map } from '../models/Map';

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
    return (
        <div className="top-menu">
            <button onClick={onToggleMode}>Toggle mode</button>
            {maps.map((map) => (
                <div key={map.id}>
                    {map.id}
                    <button onClick={() => onMapSelect(map)}>S</button>
                    {isEditMode && <button onClick={() => onMapDelete(map.id)}>D</button>}
                </div>
            ))}
            {isEditMode && <button onClick={onMapAdd}>ADD</button>}
        </div>
    );
};

export default TopMenu;
