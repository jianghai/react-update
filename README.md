# react-update

[![build status](https://img.shields.io/travis/jianghai/react-update.svg)](https://travis-ci.org/jianghai/react-update)
[![npm package](https://img.shields.io/npm/v/react-update.svg)](https://www.npmjs.org/package/react-update) 
[![NPM downloads](http://img.shields.io/npm/dm/react-update.svg)](https://npmjs.org/package/react-update)

Make setState easily and immutably.


## Installation

```sh
npm i --save react-update
```


## Usage

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

## 解决什么问题？

* 我们需要不可变数据，利用 shouldComponentUpdate 做性能优化
* 很多 state 结构是嵌套的，setState 很不方便，如 Tree 组件、父子组件通信等场景
* 实际开发中，大量的交互归结于 state 的处理，即数据的赋值、添加、删除等操作，可以减少大量的重复代码

## API

```javascript

// set
update('set', 'x', 0)
update('set', {x: 0})
update('set', {x: 0, y: 0})
update('set', 'a.b', 0)
update('set', ['a', 'b'], 0)

// push
update('push', 'list', 1)

// splice
update('splice', 'list', 0)

// return value
this.state = {x: {y: 1}}
update('set', 'x.y': 0) // => {x: {y: 0}}
```

## 开发者调试功能

非 production 模式下，调用 update 后，控制台输出 update 所属组件更新后的 state，方便定位问题


## shouldComponentUpdate 优化

update 的处理过程是不可变的，结合 shouldComponentUpdate 优化才能发挥其核心价值，为了省事，无需每个组件单独添加 shouldComponentUpdate 方法，全局定义一下即可:

```javascript
// ShadowEqual except function props.
function isEqual(source, target) {
  if (!source) return true
  return Object.keys(source).every(key => {
    let isEqual = true
    const prop = source[key]
    if (typeof prop !== 'function' && target[key] !== source[key]) {
      isEqual = false
    }
    return isEqual
  })
}

// Global optimizing for immutable data.
const prototype = React.Component.prototype
if (!prototype.shouldComponentUpdate) {
  prototype.shouldComponentUpdate = function(nextProps, nextState) {
    if (nextProps.children) return true
    return !(isEqual(nextProps, this.props) && isEqual(nextState, this.state))
  }
}
```

组件写法上也要注意：

1、使用 class 代替 React.createClass

2、除函数类型外，不要重写创建对象，否则无法保证相等

例如

```javascript
render() {
  return <div style={{color: '#999'}}></div>
}
```

需要改成

```javascript
constructor() {
  this.style = {
    color: '#999'
  }
}
render() {
  return <div style={this.style}></div>
}
```