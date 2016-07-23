## react-update

[![build status](https://img.shields.io/travis/jianghai/react-update.svg)](https://travis-ci.org/jianghai/react-update)
[![Coverage Status](https://img.shields.io/coveralls/jianghai/react-update.svg)](https://coveralls.io/r/jianghai/react-update?branch=master)

### 主要解决什么问题？

React 项目开发中，有太多的 setState 场景，且很多 state 都是嵌套的数据结构，大量的 setState 操作可以抽象成一行代码，即对数据的 set、push、splice 等，尤其在复杂表单场景的处理上堪比双向绑定般简洁，又不违背单向数据流的原则。

另外，react-update 的更新结果是不可变的，所以非常方便做 shouldComponentUpdate 性能优化。

### 实际使用对比

#### 使用前

```javascript
class Todos extends Component {
  
  constructor() {
    super()
    this.state = {
      text: '',
      items: []
    }
  }

  handleInput(e) {
    this.setState({text: e.target.value})
  }

  handleAdd() {
    const items = this.state.items
    const nextItems = items.concat([{text: this.state.text}])
    this.setState({items: nextItems})
  }

  handleRemove(index) {
    const nextItems = this.state.items.concat()
    nextItems.splice(index, 1)
    this.setState({items: nextItems})
  }

  render() {
    const { text, items } = this.state
    return (
      <div>
        <input type="text" value={value} onChange={e => this.handleInput(e)} />
        <button onClick={() => this.handleAdd()}>Add</button>
        <ul>
          {items.map((item, i) => {
            return (
              <li key={i}>
                {item.text}
                <button onClick={() => this.handleRemove(i)}></button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
```

#### 使用后

```javascript
import update from 'react-update'

class Todos extends Component {
  
  constructor() {
    super()
    this.state = {
      text: '',
      items: []
    }
  }
  
  change(type, value, path) {
    this.setState(update(this.state, type, value, path))
  }

  render() {
    const { text, items } = this.state
    return (
      <div>
        <input type="text" value={value} onChange={e => this.change('set', e.target.value, 'text')} />
        <button onClick={() => this.change('push', { text }, 'items')}>Add</button>
        <ul>
          {items.map((item, i) => {
            return (
              <li key={i}>
                {item.text}
                <button onClick={() => this.change('splice', i, 'items')}></button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
```

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
map = update(map, 'push', 2, list)
console.log(map.list) // => [2, 1, 2]

// push directly
const list = update(map.list, 'push', 3)
console.log(list) // => [2, 1, 2, 3]

// splice
map = update(map, 'splice', 0, list)
console.log(map.list) // => [1, 2, 3]
```