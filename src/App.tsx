import { useState } from 'react';
import './App.scss';
import Game from './components/Game';
import { MapTemplate } from './components/Map';

const defaultMapTemplate: string[][] = [
    ['g', 'g', 'g', 'g', 'o', 'g', 'g', 'g'],
    ['g', 'g', 'g', 'g', 'o', 'g', 'g', 'g'],
    ['g', 'g', 'g', 'g', 'o', 'g', 'b', 'g'],
    ['g', 'g', 'g', 'g', 'o', 'g', 'o', 'o'],
    ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'd'],
    ['g', 'p', 'g', 'b', 'g', 'g', 'g', 'd'],
    ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
    ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
    ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
    ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
];

function App() {
    const [mapTempate] = useState<MapTemplate>(defaultMapTemplate);

    return <Game mapTemplate={mapTempate}></Game>;
}

export default App;
