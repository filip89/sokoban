import { Field } from './Field';

export default class Box {
    id: string;
    location: Field;

    constructor(field: Field) {
        this.id = field.id;
        this.location = field;
    }
}
