import { Map } from '../models/Map';
import { MapTemplate } from '../models/MapTemplate';
import { generateMapTemplateFromContent } from '../services/TemplateGenerator';

const defaultTemplatesContent: MapTemplate[] = [
    [
        ['e', 'e', 'e', 'g', 'o', 'g', 'g', 'g'],
        ['e', 'e', 'e', 'b', 'o', 'g', 'g', 'g'],
        ['e', 'g', 'b', 'g', 'g', 'g', 'g', 'g'],
        ['e', 'e', 'g', 'g', 'o', 'g', 'o', 'o'],
        ['g', 'g', 'g', 'g', 'g', 'b', 'b', 'd'],
        ['g', 'g', 'g', 'b', 'g', 'g', 'g', 'd'],
        ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
        ['g', 'g', 'p', 'g', 'o', 'g', 'g', 'g'],
        ['g', 'g', 'e', 'g', 'g', 'g', 'g', 'g'],
        ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
    ],
    [
        ['e', 'e', 'e', 'g', 'o', 'g', 'g', 'g'],
        ['e', 'e', 'e', 'b', 'o', 'g', 'g', 'g'],
        ['e', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
        ['g', 'g', 'g', 'g', 'g', 'g', 'o', 'o'],
        ['g', 'g', 'g', 'g', 'g', 'b', 'b', 'd'],
        ['o', 'p', 'g', 'g', 'g', 'g', 'g', 'd'],
        ['o', 'g', 'g', 'g', 'g', 'b', 'g', 'g'],
        ['g', 'g', 'g', 'g', 'g', 'b', 'g', 'g'],
        ['g', 'g', 'e', 'b', 'g', 'g', 'g', 'g'],
        ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
    ],
];

const defaultMaps: Map[] = [];

defaultTemplatesContent.forEach((content, index) =>
    defaultMaps.push(new Map({
        id: index.toString(),
        isDefault: true,
        template: generateMapTemplateFromContent(content),
    }))
);

export { defaultMaps };
