# react-update

[![build status](https://img.shields.io/travis/jianghai/react-update.svg)](https://travis-ci.org/jianghai/react-update)
[![npm package](https://img.shields.io/npm/v/react-update.svg)](https://www.npmjs.org/package/react-update) 
[![NPM downloads](http://img.shields.io/npm/dm/react-update.svg)](https://npmjs.org/package/react-update)

Make setState easily and immutably.

So, why not use [immutability-helper](https://github.com/kolodny/immutability-helper)?

- No need to call setState manually
- No need to build syntactic sugar like `{x: {y: {$set: 1}}}`, just pass `x.y` and `1`


## Installation

```sh
npm i --save react-update
```


## Todo Demo

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


## API

### Bind component and execute setState automatically

```javascript
import update from 'react-update'

class App extends Component {
  
  constructor() {
    super()
    this.update = update.bind(this)
    this.state = {
      name: 'John',
      relation: {
        family: 0,
        friend: 1
      },
      honor: ['1', '2', '3']
    }
  }
  
  someUsage() {
    this.update('set', 'name', 'Wall')
    this.update('set', 'relation.family', 1)
    this.update('set', ['relation', 'family'], 0)
    this.update('set', {
      name: 'Jamas', 
      'relation.friend': 0
    })
    this.update('push', 'honor', '4') // ['1', '2', '3', '4']
    this.update('splice', 'honor', 0) // ['2', '3', '4']

    // All above actions just render once and all state has changed.
  }
}
```

### Silent usage

```javascript
import update from 'react-update'

const myData = {x: {y: 0}}
const newData = update(myData, 'set', 'x.y', 1)
console.log(newData) // {x: {y: 1}}
```


## Changelog

### v0.4.0

`2016-10-26`

- Remove console info when state change.
- Add silent usage which would not execute setState automatically.
```js
import update from 'react-update'

const myData = {x: {y: 1}}
const newData = update(myData, 'set', 'x.y', 2)
console.log(newTarget) // {x: {y: 2}}
```