import { useState } from 'react';
import './App.scss';
import Builder from './components/Builder';
import Game from './components/Game';
import { defaultMaps } from './data/defaultMaps';
import TopMenu from './components/TopMenu';
import { Map } from './models/Map';
import { v4 } from 'uuid';
import { generateEmptyMapTemplate } from './services/TemplateGenerator';
import { MapTemplate } from './models/MapTemplate';
import MapsPicker from './components/MapsPicker';

function App() {
    const [isEditMode, setIsEditMode] = useState<boolean>(true);
    const [maps, setMaps] = useState<Map[]>(defaultMaps);
    const [activeMap, setActiveMap] = useState<Map | undefined>(maps[0]);

    function handleToggleMode(): void {
        setIsEditMode(!isEditMode);
    }

    function handleMapSelect(map: Map): void {
        setActiveMap(map);
    }

    function handleMapAdd(): void {
        let mapsCopy = [...maps];
        let newMap: Map = new Map({
            id: v4(),
            template: generateEmptyMapTemplate(),
        });
        mapsCopy.push(newMap);
        setMaps(mapsCopy);
        setActiveMap(newMap);
    }

    function handleMapDelete(id: string): void {
        let remainingMaps = maps.filter((map) => map.id !== id);
        setMaps(remainingMaps);
        if (activeMap?.id === id) {
            setActiveMap(remainingMaps[0]);
        }
    }

    function handleDraftSave(mapId: string, draft: MapTemplate): void {
        setMaps(
            maps.map((map) =>
                map.id !== mapId ? map : new Map({ id: map.id, template: draft, isDefault: map.isDefault })
            )
        );
        if (activeMap?.id === mapId) {
            setActiveMap(new Map({ ...activeMap, template: draft }));
        }
    }

    return (
        <div className="app">
            <TopMenu isEditMode={isEditMode} onToggleMode={handleToggleMode} onMapAdd={handleMapAdd}>
                <MapsPicker
                    maps={maps}
                    selectedMapId={activeMap?.id}
                    isEditMode={isEditMode}
                    onMapSelect={handleMapSelect}
                    onMapDelete={handleMapDelete}
                ></MapsPicker>
            </TopMenu>
            <div className="app__mode-view">
                {activeMap &&
                    (isEditMode ? (
                        <Builder
                            mapTemplateToEdit={activeMap.template}
                            onSave={(draft) => handleDraftSave(activeMap.id, draft)}
                        ></Builder>
                    ) : (
                        <Game mapTemplate={activeMap.trimmedTemplate}></Game>
                    ))}
            </div>
        </div>
    );
}

export default App;
