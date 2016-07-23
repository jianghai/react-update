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

map = update(map, 'set', 2, ['list', 0])
console.log(map.list) // => [2, 1]

// push
map = update(map, 'push', 2, ['list'])
console.log(map.list) // => [2, 1, 2]

// push directly
map = update(map.list, 'push', 3)
console.log(map.list) // => [2, 1, 2, 3]

// splice
map = update(map, 'splice', 0, ['list'])
console.log(map.list) // => [1, 2, 3]
```