import { Map } from '../models/Map';

export interface TopMenuProps {
    maps: Map[];
    selectedMapId: string;
    onToggleMode: () => void;
    onMapSelect: (map: Map) => void;
}

const TopMenu: React.FC<TopMenuProps> = ({ maps, selectedMapId, onMapSelect, onToggleMode }) => {

    return (
        <div>
            <button onClick={onToggleMode}>Toggle mode</button>
            {maps.map((map) => (
                <button key={map.id} onClick={() => onMapSelect(map)}>
                    {map.id}
                </button>
            ))}
        </div>
    );
};

export default TopMenu;
