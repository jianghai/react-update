/**
 * Copyright 2016-present, jianghai.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */


import update from 'react-addons-update'
import warning from 'warning'

// Build target object for react-addons-update
function getTarget(type, path, value) {

  if (type === 'push') {
    value = [value]
  }
  
  if (type === 'splice') {
    value = [[value, 1]]
  }

  value = {
    ['$' + type]: value
  }

  let target = {}
  let lastKey
  if (path) {
    let temp = target
    if (Array.isArray(path)) {
      lastKey = path.pop()
      path.forEach(key => {
        temp[key] = {}
        temp = temp[key]
      })
    } else {
      lastKey = path
    }
    temp[lastKey] = value
  } else {
    target = value
  }
  return target
}

// Destruct path with first prop and remain path.
// Such as: ['a', 'b', 'c'] => ['a', ['b', 'c']].
function getDestructPath(path) {
  let prop
  if (typeof path === 'string') {
    prop = path
    path = null
  } else {
    prop = path.shift()
    if (!path.length) path = null
  }
  return [prop, path]
}


// Entry
export default function(...args) {

  if (!this) {
    warning(false, 'No `this` bind to update, try `this.update = update.bind(this)` in the constructor.')
    return 
  }
  
  let source = this.state
  let singleProp
  const nextState = {}
  const isSingle = typeof args[0] === 'string'

  // Update source object for multipe calls.
  // Warn: take care of it when react update.
  const queue = this._reactInternalInstance._pendingStateQueue
  if (queue) {
    queue.forEach(state => {
      source = Object.assign({}, source, state)
    })
  }

  if (isSingle) {
    const [type, path, value] = args
    const [prop, remainPath] = getDestructPath(path)
    nextState[prop] = update(source[prop], getTarget(type, remainPath, value))
    singleProp = prop
  } else {
    args.forEach(([type, path, value]) => {
      const [prop, remainPath] = getDestructPath(path)
      if (prop in nextState) {
        source[prop] = nextState[prop]
      }
      nextState[prop] = update(source[prop], getTarget(type, remainPath, value))
    })
  }

  this.setState(nextState)
  return isSingle ? nextState[singleProp] : nextState
}