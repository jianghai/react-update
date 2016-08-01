# react-update

[![build status](https://img.shields.io/travis/jianghai/react-update.svg)](https://travis-ci.org/jianghai/react-update)

一个简单的 React 数据流解决方案。

A simple solution of data flow for React.

![react-update](https://cdn.rawgit.com/jianghai/react-update/master/workflow.svg)

## Installation

```sh
npm i --save react-update
```

## Usage

#### 不可变的方式 setState

```javascript
import update from 'react-update'

class App extends Component {
  
  constructor() {
    super()
    this.update = update.bind(this)
  }
  
  handleAdd(text) {
    this.update('push', 'list', { text })
  }
}
```

#### 组件间通信

```javascript
import update from 'react-update'

class Parent extends Component {
  constructor() {
    super()
    this.update = update.bind(this, 'parent')
  }
}

class Child extends Component {
  constructor() {
    super()
    this.parent = update.get('parent')
    // this.parent.update ...
  }
}
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

// 基本的 set, push, splice
update('set', 'x', 0)
update('set', 'a.b', 0)
update('set', ['a', 'b'], 0)
update('push', 'list', 1)
update('splice', 'list', 0) // 0 is the index which would be removed
update('set', 'list[0]', 'hello')

// 多条操作
// 相同类型
update('set', {
  x: 2,
  'a.b': 2
})
// 不同类型
update(['set', 'x', 0], ['push', 'list', 1])

// 返回值
update('set', 'x', 0) // => 0
update('set', {
  'a.b': 0, 
  'a.c': 0
}) // => {b: 0, c: 0}
update(['set', 'x', 0], ['push', 'list', 1]) // => {x: 0, list: [0, 1]}

// Multile calls will not trigger an additional render
update('set', 'a.b', 0)
update('set', 'a.c', 0)
// When receiveProps finishs
console.log(this.state.a) // {b: 0, c: 0}

// 给组件绑定 this.update，如果指定 name（不可重复），则可通过 update.get 获取
// this.update = update(this, 'parent')
update.bind(instance, [name])

// 访问其它组件，this.parent = update.get('parent')
update.get(name)
```

## 开发者调试功能

非 production 模式下，调用 update 后，控制台输出 update 所属组件更新后的 state，方便定位问题


## 注意

##### 单向数据流 + 不可变数据结合 `shouldComponentUpdate` 才能发挥极致，为了避免反复的声明 `shouldComponentUpdate`，默认加载 `react-update` 后所有的 ES6 组件写法均自动做了 `shouldComponentUpdate` 判断（因匿名函数的存在，函数类型值忽略），所以类似这种写法：

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

##### 手动做 `shouldComponentUpdate` 判断则以手动判断的逻辑为准