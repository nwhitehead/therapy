
type Options = {
    rows?: number;
    cols?: number;
    element?: HTMLElement;
    classPrefix?: string;
    eventCallback?: any;
    delay?: number;
}

type Attributes = {
    fg?: string;
    bg?: string;
    bold?: boolean;
    underline?: boolean;
    italic?: boolean;
}

type MixedText = (string | { push: Attributes } | { pop: any } | { clear: any })[];

/// Update a span DOM element representing one character cell of framebuffer
function updateCell(c: HTMLElement, txt: string, attr?: Attributes) {
    c.style = '';
    if (attr) {
        if (attr.fg !== undefined) c.style.color = attr.fg;
        if (attr.bg !== undefined) c.style.backgroundColor = attr.bg;
        if (attr.bold) c.style.fontWeight = 'bold';
        if (attr.underline) c.style.textDecoration = 'underline';
        if (attr.italic) c.style.fontStyle = 'italic';
    }
    c.textContent = txt;
}

/// Update a span DOM element representing one character cell of framebuffer
function getCellData(c: HTMLElement): [string, Attributes] {
    const txt = c.textContent;
    let attr: Attributes = {};
    if (c.style.color !== '') attr.fg = c.style.color;
    if (c.style.backgroundColor !== '') attr.bg = c.style.backgroundColor;
    if (c.style.fontWeight === 'bold') attr.bold = true;
    if (c.style.textDecoration === 'underline') attr.underline = true;
    if (c.style.fontStyle === 'italic') attr.italic = true;
    return [txt, attr];
}

// delay for specified number of milliseconds
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class Terminal {
    /// size of terminal, rows
    rows: number;
    /// size of terminal, cols
    cols: number;
    /// where cursor is currently, [row, col]
    cursor: [number, number];
    /// current attribute for new writes (overwrites old)
    attr: Attributes;
    /// requested attr stack
    attrs: Attributes[];
    /// DOM element representing cursor
    cursorElem: HTMLElement;
    /// DOM element containing terminal
    containerElem: HTMLElement;
    /// prefix for CSS classes to add to elements
    classPrefix: string;
    /// 2D array of actual cells in terminal framebuffer
    framebuffer: HTMLElement[][];
    /// amount of time to delay between actions
    delay: number;
    /// callback to call when things happen
    callback: any;
    constructor (opts: Options) {
        this.classPrefix = opts.classPrefix ?? '';
        const prefix = this.classPrefix;
        this.rows = opts.rows ?? 25;
        this.cols = opts.cols ?? 80;
        this.delay = opts.delay ?? 20;
        this.cursor = [0, 0];
        this.attr = {};
        this.attrs = [];
        this.callback = opts.eventCallback ?? null;
        const elem = opts.element ?? document.body;
        const div = document.createElement('div');
        elem.appendChild(div);
        this.containerElem = div;
        this.containerElem.classList.add(`${prefix}terminal`);
        const cursor = document.createElement('span');
        cursor.classList.add(`${prefix}cursor`);
        cursor.textContent = "█";
        this.cursorElem = cursor;
        this.framebuffer = [];
        this.recreateFramebuffer();
        this.updateCursorElem();
    }
    /// create 2D framebuffer of 
    // need to do this on init and if size changes
    recreateFramebuffer() {
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
    /// move cursor to specified position
    moveCursor(r: number, c: number) {
        this.cursor = [r, c];
        this.updateCursorElem();
    }
    /// clear screen, move cursor to upper left
    clear() {
        this.cursor = [0, 0];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.updateCell(row, col, " ");
            }
        }
        this.updateCursorElem();
    }
    /// get single cell at specified position or throw error
    getCell(r: number, c: number): HTMLElement {
        const row = this.framebuffer[r];
        if (!row) throw new Error("r out of range");
        const cell = row[c];
        if (!cell) throw new Error("c out of range");
        return cell;
    }
    /// Move cursor element to correct parent in DOM
    updateCursorElem() {
        let [r, c] = this.cursor;
        const cell = this.getCell(r, c);
        cell.prepend(this.cursorElem);
    }
    /// update contents of single cell (removes attributes if none given)
    updateCell(r: number, c: number, txt: string, attr?: Attributes) {
        const cell = this.getCell(r, c);
        updateCell(cell, txt, attr);
    }
    /// scroll screen up one line, making bottom line blank (do not move cursor)
    // blank line has current attr but no contents
    scrollUp() {
        for (let row = 0; row < this.rows - 1; row++) {
            for (let col = 0; col < this.cols; col++) {
                let [txt, attr] = getCellData(this.getCell(row + 1, col));
                this.updateCell(row, col, txt, attr);
            }
        }
        for (let col = 0; col < this.cols; col++) {
            this.updateCell(this.rows - 1, col, " ", this.attr);
        }
    }
    /// advance cursor position
    cursorNext() {
        let [r, c] = this.cursor;
        c += 1;
        if (c === this.cols) {
            c = 0;
            r += 1;
            if (r === this.rows) {
                r -= 1;
                this.scrollUp();
            }
        }
        this.cursor = [r, c];
        this.updateCursorElem();
    }
    /// prev cursor position
    cursorPrev() {
        let [r, c] = this.cursor;
        c -= 1;
        if (c === -1) {
            c = 0;
        }
        this.cursor = [r, c];
        this.updateCursorElem();
    }
    /// cursor go to next line
    cursorEnter() {
        let [r, c] = this.cursor;
        c = 0;
        r += 1;
        if (r === this.rows) {
            r -= 1;
            // scroll?
        }
        this.cursor = [r, c];
        this.updateCursorElem();
    }
    /// write one character with current attributes at cursor position
    writeChar(txt: string) {
        let [r, c] = this.cursor;
        if (txt === '\n') {
            this.cursorEnter();
            return;
        }
        if (txt === '\b') {
            this.cursorPrev();
            return;
        }
        this.updateCell(r, c, txt, this.attr);
        this.cursorNext();
    }
    /// write string with current attributes
    write(data: string) {
        for (const ch of data) {
            this.writeChar(ch);
        }
    }
    /// write string with temp attributes overloading current ones, pop at end
    writeAttrib(data: string, attr: Attributes) {
        const oldAttr = this.attr;
        this.attr = { ...this.attr, ...attr };
        for (const ch of data) {
            this.writeChar(ch);
        }
        this.attr = oldAttr;
    }
    /// push new extra attrs
    pushAttr(attr: Attributes) {
        // keep copy of existing
        const cur = { ...this.attr };
        this.attrs.push(cur);
        // overwrite stuff
        this.attr = { ...this.attr, ...attr };
    }
    /// pop back attr
    popAttr() {
        const old = this.attrs.pop();
        if (old === undefined) throw new Error("No attribute to pop");
        this.attr = old;
    }
    /// write mixed text that incorporates attribute push/pop
    writeMixed(msg: MixedText) {
        for (const item of msg) {
            if (typeof item === 'string') {
                this.write(item);
            } else if (Array.isArray(item)) {
                if (item[0] === 'push') {
                    this.pushAttr(item[1]);
                } else if (item[0] === 'pop') {
                    this.popAttr();
                } else {
                    throw new Error("Unknown array item");
                }
            } else {
                throw new Error("Unknown item type");
            }
        }
    }
    async writeAsync(data:string) {
        for (const ch of data) {
            this.writeChar(ch);
            await delay(this.delay);
            if (this.callback) {
                this.callback({ type: 'write', data: ch});
            }
        }
    }
    /// write mixed text that incorporates attribute push/pop
    async writeMixedAsync(msg: MixedText) {
        for (const item of msg) {
            if (typeof item === 'string') {
                await this.writeAsync(item);
            } else if (typeof item === 'object') {
                if (item.push !== undefined) {
                    this.pushAttr(item.push);
                } else if (item.pop !== undefined) {
                    this.popAttr();
                } else if (item.clear !== undefined) {
                    this.clear();
                } else {
                    throw new Error("Unknown array item");
                }
            } else {
                throw new Error("Unknown item type");
            }
            await delay(this.delay);
        }
    }
}
