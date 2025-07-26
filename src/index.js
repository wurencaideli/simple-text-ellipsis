import { addElementClass, removeElement, removeElementClass } from './common';
export class SimpleTextEllipsis {
    isDestroyed = false;
    maxLines = 0;
    targetEl = undefined;
    expandEl = undefined;
    collapseEl = undefined;
    placeholderEl = undefined;
    isOpen = false;
    #lineHeight = 0;
    constructor(options = {}) {
        const targetEl = options.targetEl;
        const isOpen = options.isOpen;
        const maxLines = options.maxLines;
        const expandEl = document.createElement('span');
        const collapseEl = document.createElement('div');
        const placeholderEl = document.createElement('div');
        expandEl.innerText = options.expandElText || 'Expand';
        collapseEl.innerText = options.collapseElText || 'Collapse';
        expandEl.onclick = () => {
            this.#handleExpand();
        };
        collapseEl.onclick = () => {
            this.#handleCollapse();
        };
        addElementClass(collapseEl, 'simple-text-ellipsis-collapse');
        addElementClass(expandEl, 'simple-text-ellipsis-expand');
        addElementClass(placeholderEl, 'simple-text-ellipsis-placeholder');
        targetEl.prepend(expandEl);
        targetEl.prepend(placeholderEl);
        targetEl.appendChild(collapseEl);
        this.targetEl = targetEl;
        this.isOpen = isOpen;
        this.maxLines = maxLines;
        this.expandEl = expandEl;
        this.collapseEl = collapseEl;
        this.placeholderEl = placeholderEl;
        this.update();
    }
    /** 销毁实例 */
    destroy() {
        this.isOpen = true;
        removeElement(this.expandEl);
        removeElement(this.collapseEl);
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
    #handleExpand() {
        if (this.isDestroyed) return;
        this.isOpen = true;
        this.update();
    }
    #handleCollapse() {
        if (this.isDestroyed) return;
        this.isOpen = false;
        this.update();
    }
    /** 设置容器的类名 */
    #setupClass() {
        const targetEl = this.targetEl;
        if (!targetEl) return;
        if (!this.isDestroyed) {
            targetEl.style.setProperty('--max-lines', `${this.maxLines}`);
        } else {
            targetEl.style.setProperty('--max-lines', undefined);
        }
        if (this.maxLines == 1) {
            addElementClass(targetEl, 'simple-text-ellipsis-one');
            removeElementClass(targetEl, 'simple-text-ellipsis-more');
        } else {
            addElementClass(targetEl, 'simple-text-ellipsis-more');
            removeElementClass(targetEl, 'simple-text-ellipsis-one');
        }
        if (this.isOpen) {
            removeElementClass(targetEl, 'simple-text-ellipsis-more');
            removeElementClass(targetEl, 'simple-text-ellipsis-one');
        }
        removeElementClass(targetEl, 'is-ellipsis');
        removeElementClass(targetEl, 'is-exceeded-max-line');
    }
    /** 设置按钮的类名 */
    #setupBtClass() {
        if (this.isDestroyed) return;
        const targetEl = this.targetEl;
        if (!targetEl) return;
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
        const placeholderEl = this.placeholderEl;
        const targetEl = this.targetEl;
        placeholderEl.style.height = `${targetEl.clientHeight - lineHeight}px`;
    }
    /** 获取一行文本的高度 */
    #getLineHeight() {
        const targetEl = this.targetEl;
        if (!targetEl) return;
        return parseFloat(getComputedStyle(targetEl).lineHeight) || 24;
    }
    /** 判断是否省略了 */
    #isEllipsisActive() {
        const maxLines = this.maxLines;
        const el = this.targetEl;
        if (maxLines === 1) {
            return el.scrollWidth > el.clientWidth;
        }
        return el.scrollHeight > el.clientHeight;
    }
    /** 获取文本视觉上的行数 */
    #getActualLines() {
        const targetEl = this.targetEl;
        const collapseEl = this.collapseEl;
        const lh = this.#lineHeight;
        return Math.floor((targetEl.clientHeight - collapseEl.clientHeight) / lh);
    }
}
