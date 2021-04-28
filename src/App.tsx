import { useState } from 'react';
import './App.scss';
import Builder from './components/Builder';
import Game from './components/Game';
import { defaultMaps } from './data/defaultMaps';
import TopMenu from './components/TopMenu';
import { Map } from './models/Map';
import { v4 } from 'uuid';
import { generateEmptyMapTemplate } from './services/generateEmptyMapTemplate';
import { MapTemplate } from './models/MapTemplate';

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
        let newMap: Map = {
            id: v4(),
            template: generateEmptyMapTemplate(),
        };
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
            maps.map((map) => {
                if (map.id !== mapId) return map;
                let mapCopy = { ...map };
                mapCopy.template = draft;
                return mapCopy;
            })
        );
        if (activeMap?.id === mapId) {
            setActiveMap({ ...activeMap, template: draft });
        }
    }

    return (
        <div className="app">
            <TopMenu
                maps={maps}
                selectedMapId={activeMap?.id}
                isEditMode={isEditMode}
                onToggleMode={handleToggleMode}
                onMapSelect={handleMapSelect}
                onMapAdd={handleMapAdd}
                onMapDelete={handleMapDelete}
            ></TopMenu>
            <div className="app__mode-view">
                {activeMap &&
                    (isEditMode ? (
                        <Builder
                            mapTemplateToEdit={activeMap.template}
                            onSave={(draft) => handleDraftSave(activeMap.id, draft)}
                        ></Builder>
                    ) : (
                        <Game mapTemplate={activeMap.template}></Game>
                    ))}
            </div>
        </div>
    );
}

export default App;
