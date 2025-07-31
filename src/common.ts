export function removeElement(element: HTMLElement) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}
export function addElementClass(el: HTMLElement, className: string) {
    el.classList.add(className);
}
export function removeElementClass(el: HTMLElement, className: string) {
    el.classList.remove(className);
}
