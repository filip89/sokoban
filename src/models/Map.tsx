import { trimTemplateSides } from '../services/TemplateTrimmer';
import { MapTemplate } from './MapTemplate';

export class Map {
    id: string;
    isDefault: boolean = false;
    trimmedTemplate!: MapTemplate;
    private _template!: MapTemplate;

    set template(value: MapTemplate) {
        this._template = value;
        this.trimmedTemplate = trimTemplateSides(value);
    }

    get template(): MapTemplate {
        return this._template;
    }

    constructor(data: { id: string; template: MapTemplate; isDefault?: boolean }) {
        this.id = data.id;
        this.template = data.template;
        if (data.isDefault) this.isDefault = data.isDefault;
    }
}
