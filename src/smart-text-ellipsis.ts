import { addElementClass, removeElement, removeElementClass } from './common';
type Option = {
    targetEl: HTMLElement;
    isOpen: boolean;
    stopClickPropagation: boolean;
    maxLines: number;
    expandElText: string;
    collapseElText: string;
    afterExpand: (() => void) | undefined;
    afterCollapse: (() => void) | undefined;
};
export class SmartTextEllipsis {
    isDestroyed: boolean = false;
    maxLines: number = 0;
    targetEl: HTMLElement | undefined;
    expandEl: HTMLElement | undefined;
    collapseEl: HTMLElement | undefined;
    placeholderEl: HTMLElement | undefined;
    isOpen: boolean = false;
    afterExpand: (() => void) | undefined = undefined;
    afterCollapse: (() => void) | undefined = undefined;
    stopClickPropagation: boolean = false;
    #lineHeight: number = 0;
    constructor(options: Option) {
        const targetEl = options.targetEl;
        const isOpen = options.isOpen;
        const maxLines = options.maxLines;
        const stopClickPropagation = options.stopClickPropagation;
        const afterExpand = options.afterExpand;
        const afterCollapse = options.afterCollapse;
        const expandEl = document.createElement('span');
        const collapseEl = document.createElement('div');
        const placeholderEl = document.createElement('div');
        expandEl.innerText = options.expandElText || 'Expand';
        collapseEl.innerText = options.collapseElText || 'Collapse';
        addElementClass(collapseEl, 'smart-text-ellipsis-collapse');
        addElementClass(expandEl, 'smart-text-ellipsis-expand');
        addElementClass(placeholderEl, 'smart-text-ellipsis-placeholder');
        targetEl.prepend(expandEl);
        targetEl.prepend(placeholderEl);
        targetEl.appendChild(collapseEl);
        this.targetEl = targetEl;
        this.isOpen = isOpen;
        this.maxLines = maxLines;
        this.expandEl = expandEl;
        this.collapseEl = collapseEl;
        this.placeholderEl = placeholderEl;
        this.stopClickPropagation = stopClickPropagation;
        this.afterExpand = afterExpand;
        this.afterCollapse = afterCollapse;
        expandEl.onclick = (e) => {
            if (this.stopClickPropagation) {
                e.stopPropagation();
            }
            this.#handleExpand();
        };
        collapseEl.onclick = (e) => {
            if (this.stopClickPropagation) {
                e.stopPropagation();
            }
            this.#handleCollapse();
        };
        this.update();
    }
    /** 销毁实例 */
    destroy() {
        this.isOpen = true;
        removeElement(this.expandEl as HTMLElement);
        removeElement(this.collapseEl as HTMLElement);
        this.#setupClass();
        this.targetEl = undefined;
        this.expandEl = undefined;
        this.collapseEl = undefined;
        this.isDestroyed = true;
    }
    /** 更新样式 */
    update() {
        if (this.isDestroyed) return;
        this.#lineHeight = this.#getLineHeight();
        this.#setupClass();
        this.#setupPlaceholderStyle();
        this.#setupBtClass();
    }
    expand() {
        this.#handleExpand();
    }
    collapse() {
        this.#handleCollapse();
    }
    #handleExpand() {
        if (this.isDestroyed) return;
        this.isOpen = true;
        this.update();
        if (this.afterExpand) {
            this.afterExpand();
        }
    }
    #handleCollapse() {
        if (this.isDestroyed) return;
        this.isOpen = false;
        this.update();
        if (this.afterCollapse) {
            this.afterCollapse();
        }
    }
    /** 设置容器的类名 */
    #setupClass() {
        const targetEl = this.targetEl;
        if (!targetEl) return;
        if (!this.isDestroyed) {
            targetEl.style.setProperty('--max-lines', `${this.maxLines}`);
        } else {
            targetEl.style.setProperty('--max-lines', null);
        }
        if (this.maxLines == 1) {
            addElementClass(targetEl, 'smart-text-ellipsis-one');
            removeElementClass(targetEl, 'smart-text-ellipsis-more');
        } else {
            addElementClass(targetEl, 'smart-text-ellipsis-more');
            removeElementClass(targetEl, 'smart-text-ellipsis-one');
        }
        if (this.isOpen) {
            removeElementClass(targetEl, 'smart-text-ellipsis-more');
            removeElementClass(targetEl, 'smart-text-ellipsis-one');
        }
        removeElementClass(targetEl, 'is-ellipsis');
        removeElementClass(targetEl, 'is-exceeded-max-line');
    }
    /** 设置按钮的类名 */
    #setupBtClass() {
        if (this.isDestroyed) return;
        const targetEl = this.targetEl as HTMLElement;
        if (this.isOpen) {
            // 如果行数超过了，显示收缩按钮
            if (this.#getActualLines() > this.maxLines) {
                addElementClass(targetEl, 'is-exceeded-max-line');
            }
        } else {
            // 如果字体省略了，显示展开按钮
            if (this.#isEllipsisActive()) {
                addElementClass(targetEl, 'is-ellipsis');
            }
        }
    }
    /** 设置占位元素的样式 */
    #setupPlaceholderStyle() {
        const lineHeight = this.#lineHeight;
        const placeholderEl = this.placeholderEl as HTMLElement;
        const targetEl = this.targetEl as HTMLElement;
        placeholderEl.style.height = `${targetEl.clientHeight - lineHeight}px`;
    }
    /** 获取一行文本的高度 */
    #getLineHeight(): number {
        const targetEl = this.targetEl as HTMLElement;
        return parseFloat(getComputedStyle(targetEl).lineHeight) || 24;
    }
    /** 判断是否省略了 */
    #isEllipsisActive(): boolean {
        const maxLines = this.maxLines;
        const el = this.targetEl as HTMLElement;
        if (maxLines === 1) {
            return el.scrollWidth > el.clientWidth;
        }
        return el.scrollHeight > el.clientHeight;
    }
    /** 获取文本视觉上的行数 */
    #getActualLines(): number {
        const targetEl = this.targetEl as HTMLElement;
        const collapseEl = this.collapseEl as HTMLElement;
        const lh = this.#lineHeight;
        return Math.floor((targetEl.clientHeight - collapseEl.clientHeight) / lh);
    }
}
