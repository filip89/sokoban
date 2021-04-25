import { useState } from 'react';
import './App.scss';
import Builder from './components/Builder';
import Game from './components/Game';
import { defaultMaps } from './data/defaultMaps';
import TopMenu from './components/TopMenu';
import { Map } from './models/Map';

type Mode = 'play' | 'build';

function App() {
    const [maps] = useState<Map[]>(defaultMaps);
    const [mode, setMode] = useState<Mode>('play');
    const [activeMap, setActiveMap] = useState<Map>(defaultMaps[0]);

    function isPlayMode(): boolean {
        return mode === 'play';
    }

    function handleToggleMode(): void {
        setMode(isPlayMode() ? 'build' : 'play');
    }

    function handleMapSelect(map: Map): void {
        setActiveMap(map);
    }

    return (
        <>
            <TopMenu
                maps={maps}
                selectedMapId={activeMap.id}
                onToggleMode={handleToggleMode}
                onMapSelect={handleMapSelect}
            ></TopMenu>
            {isPlayMode() ? activeMap && <Game mapTemplate={activeMap.template}></Game> : <Builder></Builder>}
        </>
    );
}

export default App;
