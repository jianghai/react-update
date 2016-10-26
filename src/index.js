/**
 * Copyright 2016-present, jianghai.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import { Component } from 'react'
import reactAddonsUpdate from 'react-addons-update'
import warning from 'warning'

const LAST_STATE = '__lastState'
const isPlainObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

const getExtendDataCommand = (type, value) => {
  if (type === 'push') {
    value = [value]
  } else if (type === 'splice') {
    value = [[value, 1]]
  }
  value = {
    ['$' + type]: value
  }
  return value
}

// [a, b] with 1 => {a: {b: 1}}
const getNestedDataTarget = (path, value) => {
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

// Get the second parameter of `https://facebook.github.io/react/docs/update.html`
const getExtendData = (type, path, value) => {
  return getNestedDataTarget(path, getExtendDataCommand(type, value))
}

// 'a.b.c' => ['a', 'b', 'c']
const getPathArray = path => {
  if (typeof path === 'string') {
    path = path.split(/\.|\[|\]/).filter(v => !!v)
  }
  return path
}

// Destruct path with first prop and remain path.
// Such as: 'a.b.c' or ['a', 'b', 'c'] and return ['a', ['b', 'c']].
const getDestructPath = path => {
  path = getPathArray(path)
  const prop = path.shift()
  if (!path.length) path = null
  return [prop, path]
}

// Get the result of `https://facebook.github.io/react/docs/update.html`
const getSingleExtendData = (source, type, path, value) => {
  return reactAddonsUpdate(source, getExtendData(type, path, value))
}

// If you bind update to the instance of React Component, the arguments could be 
// [type, path, value] or [type, {path1: value1, path2: value2}] which was changed 
// based on the component state and execute stateState automatically. 
// Another way, if you call update purely, the argumets could be 
// [target, type, path, value], the path is not required and will not execute stateState.
// Anyway, the return value of update would be the newData, if you changed multuple 
// props, the newData would be an key-value object.
const update = function(...args) {

  if (this && this.isReactComponent) {

    // Cache prevState when call this.update multiple times.
    // Warn: take care of it when react update.
    const queue = this._reactInternalInstance._pendingStateQueue
    if (queue) {
      if (this[LAST_STATE]) {
        Object.assign(this[LAST_STATE], queue.pop())
      } else {
        this[LAST_STATE] = Object.assign({}, this.state, queue.pop())
      }
    } else {
      delete this[LAST_STATE]
    }

    const [type, path, value] = args
    const currentState = this[LAST_STATE] || this.state
    const nextState = {}

    const updateNextState = (type, path, value) => {
      if (isPlainObject(path)) {
        // For multipe props
        Object.keys(path).forEach(key => {
          updateNextState(type, key, path[key])
        })
      } else {
        const [prop, remainPath] = getDestructPath(path)
        if (!remainPath && type === 'set') {
          // No need to update immutably
          nextState[prop] = value
        } else {
          // Prevent to be overrided when call update by multipe props
          if (prop in nextState) {
            currentState[prop] = nextState[prop]
          }
          nextState[prop] = getSingleExtendData(currentState[prop], type, remainPath, value)
        }
      }
    }

    updateNextState(type, path, value)
    this.setState(nextState)

    const keys = Object.keys(nextState)
    return keys.length === 1 ? nextState[keys[0]] : nextState

  } else {

    const [source, type, path, value] = args
    return getSingleExtendData(source, type, getPathArray(path), value)
  }
}

export default update