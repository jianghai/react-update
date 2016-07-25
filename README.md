## react-update

[![build status](https://img.shields.io/travis/jianghai/react-update.svg)](https://travis-ci.org/jianghai/react-update)

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
        <input type="text" value={value} onChange={e => update('set', e.target.value, 'text')} />
        <button onClick={() => update('push', { text }, 'items')}>Add</button>
        <ul>
          {items.map((item, i) => {
            return (
              <li key={i}>
                {item.text}
                <button onClick={() => update('splice', i, 'items')}></button>
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

### API

#### 单个属性

`update(type, value, path)`

#### 多个属性
`update([type, value, path], [type, value, path], ...)`

#### type
目前支持 `set`、`push`、`splice` 三种方式

#### value
当 `type` 是 `splice`, `value` 值是 `Array.prototype.splice` 的第一个参数，默认删除一条，多条暂不支持，可以处理后用 `set` 方式

#### path
```javascript
// single
update('set', 1, 'text') // Simply like `this.state.text = 1`

// nested
update('set', 1, ['x', 'y']) // Simply like `this.state.x.y = 1`
```