/**
 * Copyright 2016-present, jianghai.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */


import React from 'react'
import _update from 'react-addons-update'
import warning from 'warning'

const LAST_STATE = '__lastState'

// Build target object for react-addons-update
function getTarget(type, path, value) {

  if (type === 'push') {
    value = [value]
  } else if (type === 'splice') {
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
// Such as: 'a.b.c' or ['a', 'b', 'c'] and return ['a', ['b', 'c']].
function getDestructPath(path) {
  if (typeof path === 'string') {
    path = path.split(/\.|\[|\]/).filter(v => !!v)
  } 
  const prop = path.shift()
  if (!path.length) path = null
  return [prop, path]
}

// Entry and namespace
const update = function(...args) {

  if (!this) {
    warning(false, 'No `this` bind to update, try `this.update = update.bind(this)` in the constructor.')
    return 
  }
  
  let source = this.state
  const nextState = {}
  const isSingle = typeof args[0] === 'string'

  function updateNextState(type, path, value) {
    if (Object.prototype.toString.call(path) === '[object Object]') {
      Object.keys(path).forEach(key => {
        updateNextState(type, key, path[key])
      })
    } else {
      const [prop, remainPath] = getDestructPath(path)
      if (!remainPath && type === 'set') {
        nextState[prop] = value
      } else {
        if (prop in nextState) {
          // Prevent to be overrided
          source[prop] = nextState[prop]
        }
        nextState[prop] = _update(source[prop], getTarget(type, remainPath, value))
      }
    }
  }

  // Update source object for multipe calls.
  // Warn: take care of it when react update.
  const queue = this._reactInternalInstance._pendingStateQueue
  if (queue) {
    this[LAST_STATE] = Object.assign(this[LAST_STATE] || {}, queue[queue.length - 1])
    source = Object.assign({}, source, this[LAST_STATE])
  } else {
    delete this[LAST_STATE]
  }

  if (isSingle) {
    updateNextState(...args)
  } else {
    args.forEach(arg => {
      updateNextState(...arg)
    })
  }

  this.setState(nextState)

  if (process.env.NODE_ENV !== 'production') {
    console.info(this.constructor.name + ' new state: ', nextState)
  }

  const keys = Object.keys(nextState)
  return keys.length === 1 ? nextState[keys[0]] : nextState
}

export default update