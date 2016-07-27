## react-update

[![build status](https://img.shields.io/travis/jianghai/react-update.svg)](https://travis-ci.org/jianghai/react-update)

以不可变的方式便捷更新 state

### 单个组件内实际使用对比

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

### Installation

```sh
npm i --save react-update
```

### API

```javascript

// state
{
  x: 1,
  a: {
    b: 1
  },
  list: [0]
}

update('set', 'x', 0)
update('set', ['a', 'b'], 0)
update('push', 'list', 1)
update('splice', 'list', 0) // 0 是要删除的元素的索引
update('set', ['list', 0], 'hello')

// 一次更新多条属性
update(['set', 'x', 0], ['push', 'list', 1])

// 返回值
update('set', 'x', 0) // => 0
update(['set', 'x', 0], ['push', 'list', 1]) // => {x: 0, list: [0, 1]}
```

### 特性

* update 的处理过程是不可变的，所以 update 之后，this.state 的值并未改变，方便做 shouldComponentUpdate 性能优化
* update 返回值是改变后的值
* 多次调用 update 时，相当于多次调用 this.setState，但属于增量更新
```javascript
// state
{
  a: {
    b: 1
  }
}
update('set', ['a', 'b'], 0) // => {a: {b: 0}}
update('set', ['a', 'c'], 0) // => {a: {b: 0, c: 0}}
```

### 主要解决什么问题？

1、React 项目开发中，有太多的 setState 场景，且很多 state 都是嵌套的数据结构，大量的 setState 操作可以抽象成一行代码，即对数据的 set、push、splice 等，尤其在复杂表单场景的处理上堪比双向绑定般简洁，又不违背单向数据流的原则。

2、React 组件间没有绑定数据关系，组件通信遵循单向数据流方式，便于测试、维护。但单向数据流要求数据自上而下流动，且组件的嵌套关系常常是数据的嵌套关系，导致任何一个子组件相关的数据改变后都需要通知父级，即任何一次细小的改变可能让庞大的组件树重新执行一遍虚拟 DOM 的计算，虽然可以用 shouldComponentUpdate 做优化，但需要数据是不可变的才能快速比较是否变化，所以需要一个工具可以方便更新 state 并保证数据是不可变的。

### 为什么不用 Redux 等数据流方案？

1、不是特别复杂的交互场景下，以局部 state 更新为主，没有必要全部通过跟节点开始渲染，且组件的嵌套性决定状态的非扁平性
2、目前为止还没有必要抽离 store、view、action，产品的可维护性瓶颈不在于此，没必要带来更多的学习成本

### 如何处理组件间的通信？

父子组件、可复用的组件（组件库、项目内公共的组件）通过回调去通知调用者，避免使用 context 等方式来保证可复用组件的纯粹性。

跨级组件通信情况下，直接使用 context 更新状态

```javascript
class Child extends Component {
  
  update(type, path, value) {
    this.context.parent.update(type, ['a', 'b'].concat(path), value)
  }
  
  render() {}
}
```

** 大范围的更新请做好 shouldComponentUpdate 判断 **