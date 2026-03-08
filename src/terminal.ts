
type Options = {
    rows?: number;
    cols?: number;
    element?: HTMLElement;
    classPrefix?: string;
}

type Attributes = {
    fg?: string;
    bg?: string;
    bold?: boolean;
    underline?: boolean;
}

/// Update a span DOM element representing one character cell of framebuffer
function updateCell(c: HTMLElement, txt: string, attr?: Attributes) {
    if (attr) {
        if (attr.fg !== undefined) c.style.color = attr.fg;
        if (attr.bg !== undefined) c.style.backgroundColor = attr.bg;
        if (attr.bold) c.style.fontWeight = 'bold';
        if (attr.underline) c.style.textDecoration = 'underline';
    }
    c.textContent = txt;
}

export class Terminal {
    rows: number;
    cols: number;
    cursor: [number, number];
    cursorElem: HTMLElement;
    containerElem: HTMLElement;
    classPrefix: string;
    framebuffer: HTMLElement[][];
    //data: (string, )
    constructor (opts: Options) {
        this.classPrefix = opts.classPrefix ?? '';
        const prefix = this.classPrefix;
        this.rows = opts.rows ?? 24;
        this.cols = opts.cols ?? 80;
        this.cursor = [0, 0];
        const elem = opts.element ?? document.body;
        const div = document.createElement('div');
        elem.appendChild(div);
        this.containerElem = div;
        this.containerElem.classList.add(`${prefix}terminal`);
        const cursor = document.createElement('span');
        cursor.classList.add(`${prefix}cursor`);
        cursor.style.position = 'absolute';
        cursor.textContent = "█";
        this.cursorElem = cursor;
        this.framebuffer = [];
        this.recreateFramebuffer();
        this.updateCursorElem();
    }
    recreateFramebuffer() {
        // Create framebuffer
        const prefix = this.classPrefix;
        this.framebuffer = [];
        this.containerElem.textContent = '';
        for (let row = 0; row < this.rows; row++) {
            const rowCells = [];
            const rowElem = document.createElement('div');
            rowElem.classList.add(`${prefix}row`);
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('span');
                updateCell(cell, " ");
                rowCells.push(cell);
                rowElem.appendChild(cell);
            }
            this.framebuffer.push(rowCells);
            this.containerElem.appendChild(rowElem);
        }
    }
    getCell(r: number, c: number): HTMLElement {
        const row = this.framebuffer[r];
        if (!row) throw new Error("Row out of range");
        const cell = row[c];
        if (!cell) throw new Error("Col out of range");
        return cell;
    }
    /// Move cursor element to right parent in DOM
    updateCursorElem() {
        let [r, c] = this.cursor;
        const cell = this.getCell(r, c);
        cell.appendChild(this.cursorElem);
    }
    updateFramebuffer() {
        //this.containerElem.appendChild(createCell('X', { bold: true, fg: '#f00' }));
        // this.containerElem.appendChild(this.cursorElem);
    }
    write(data: string) {
        //this.recreateFramebuffer();
    }
}
