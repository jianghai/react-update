## react-update

### Installation

```sh
npm i --save react-update
```

### Examples

```javascript
import update from 'react-update'

let map = {
  x: {
    y: 1
  },
  list: [0, 1]
}

// set
map = update(map, 'set', 2, ['x', 'y'])
console.log(map.x.y) // => 2

// push
map = update(map, 'push', 2, ['list'])
console.log(map.list.length) // => 3

// splice
map = update(map, 'splice', 1, ['list'])
console.log(map.list) // => [0, 2]
```