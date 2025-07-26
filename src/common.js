export function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}
export function addElementClass(el, className) {
    el.classList.add(className);
}
export function removeElementClass(el, className) {
    el.classList.remove(className);
}
