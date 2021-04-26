import { MapTemplate } from "./MapTemplate";

export interface Map {
    id: string;
    template: MapTemplate;
    isDefault?: boolean;
}