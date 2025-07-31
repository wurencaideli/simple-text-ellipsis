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
export declare class SmartTextEllipsis {
    #private;
    isDestroyed: boolean;
    maxLines: number;
    targetEl: HTMLElement | undefined;
    expandEl: HTMLElement | undefined;
    collapseEl: HTMLElement | undefined;
    placeholderEl: HTMLElement | undefined;
    isOpen: boolean;
    afterExpand: (() => void) | undefined;
    afterCollapse: (() => void) | undefined;
    stopClickPropagation: boolean;
    constructor(options: Option);
    /** 销毁实例 */
    destroy(): void;
    /** 更新样式 */
    update(): void;
    expand(): void;
    collapse(): void;
}
export {};
