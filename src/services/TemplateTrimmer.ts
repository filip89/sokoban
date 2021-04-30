import { MapTemplate } from '../models/MapTemplate';

interface Span {
    start: number;
    end: number;
}

/**
 * Removes unnecessary empty fields on sides
 */
export function trimTemplateSides(template: MapTemplate): MapTemplate {
    const rowSpan: Span = {
        start: template.length - 1,
        end: 0,
    };
    const colSpan: Span = {
        start: template[0].length - 1,
        end: 0,
    };

    template.forEach((row, rowIndex) => {
        row.forEach((sign, columnIndex) => {
            if (sign !== 'e') {
                tryUpdateSpan(rowIndex, rowSpan);
                tryUpdateSpan(columnIndex, colSpan);
            }
        });
    });

    let rowTrimmedTemplate: MapTemplate = template.slice(rowSpan.start, rowSpan.end + 1);

    let trimmedTemplate: MapTemplate = rowTrimmedTemplate.map((row) => row.slice(colSpan.start, colSpan.end + 1));

    return trimmedTemplate;
}

function tryUpdateSpan(index: number, span: Span): void {
    if (index < span.start) {
        span.start = index;
    }
    if (index > span.end) {
        span.end = index;
    }
}
