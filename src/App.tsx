import { useState } from 'react';
import './App.scss';
import Game from './components/Game';
import { MapFieldSign, MapTemplate } from './models/MapTemplate';

const defaultMapTemplate: MapFieldSign[][] = [
    ['e', 'e', 'e', 'g', 'o', 'g', 'g', 'g'],
    ['e', 'e', 'e', 'g', 'o', 'g', 'g', 'g'],
    ['e', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
    ['e', 'e', 'g', 'g', 'o', 'g', 'o', 'o'],
    ['g', 'g', 'g', 'g', 'g', 'b', 'g', 'd'],
    ['g', 'p', 'g', 'b', 'g', 'g', 'g', 'd'],
    ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
    ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
    ['g', 'g', 'e', 'g', 'g', 'g', 'g', 'g'],
    ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
];

function App() {
    const [mapTempate] = useState<MapTemplate>(defaultMapTemplate);

    return <Game mapTemplate={mapTempate}></Game>;
}

export default App;
