# react-update

[![build status](https://img.shields.io/travis/jianghai/react-update.svg)](https://travis-ci.org/jianghai/react-update)

以不可变的方式便捷更新 state

setState easy and immutably

![react-update](https://cdn.rawgit.com/jianghai/react-update/master/workflow.svg)

## 单个组件内实际使用对比（Compare）

#### Before

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

#### After

```javascript
import update from 'react-update'

class Todos extends Component {
  
  constructor() {
    super()
    this.update = update.bind(this)
    this.state = {
      text: '',
      items: []
    }
  }

  render() {
    const { text, items } = this.state
    const update = this.update
    return (
      <div>
        <input type="text" value={text} onChange={e => update('set', 'text', e.target.value)} />
        <button onClick={() => update('push', 'items', { text })}>Add</button>
        <ul>
          {items.map((item, i) => {
            return (
              <li key={i}>
                {item.text}
                <button onClick={() => update('splice', 'items', i)}></button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
```

## Installation

```sh
npm i --save react-update
```

## API

```javascript

// state
{
  x: 1,
  a: {
    b: 1
  },
  list: [0]
}

// Basic set, push, splice
update('set', 'x', 0)
update('set', ['a', 'b'], 0)
update('push', 'list', 1)
update('splice', 'list', 0) // 0 is the index which would be removed
update('set', ['list', 0], 'hello')

// Multiple orders
update(['set', 'x', 0], ['push', 'list', 1])

// Return value
update('set', 'x', 0) // => 0
update(['set', ['a', 'b'], 0], ['set', ['a', 'c'], 0]) // => {b: 0, c: 0}
update(['set', 'x', 0], ['push', 'list', 1]) // => {x: 0, list: [0, 1]}

// Multile calls will not trigger an additional render
update('set', ['a', 'b'], 0)
update('set', ['a', 'c'], 0)
// When receiveProps finishs
console.log(this.state.a) // {b: 0, c: 0}
```