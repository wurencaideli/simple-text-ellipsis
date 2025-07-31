## Introduction

Hide and display long text.

When you have a long text, displaying it directly may not be a good idea. You need an expand and collapse function.

[DEMO](https://wurencaideli.github.io/smart-text-ellipsis/demo.html)

#### install

```javascript
npm install smart-text-ellipsis
```

#### How to use

```javascript
import { SmartTextEllipsis } from 'smart-text-ellipsis';
/** import css */
import 'smart-text-ellipsis/dist/smart-text-ellipsis.css';
const ddInstanceList = [];
const el = document.getElementById('demo-1');
const ddInstance = new SmartTextEllipsis({
    targetEl: el,
    isOpen: false,
    maxLines: 2,
    stopClickPropagation: true,
    expandElText: 'Expand',
    collapseElText: 'Collapse',
    afterExpand() {
        console.log('Expanded');
    },
    afterCollapse() {
        console.log('Collapsed');
    },
});
ddInstanceList.push(ddInstance);
window.ddInstance = ddInstance;
/**
 * update style
 */
function updateDdInstance() {
    setTimeout(() => {
        ddInstanceList.forEach((item) => {
            item.update();
        });
        updateDdInstance();
    }, 700);
}
updateDdInstance();
```