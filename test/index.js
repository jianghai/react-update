import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import update from '../src'

describe('update', () => {

  class Test extends Component {

    constructor() {
      super()
      this.update = update.bind(this)
      this.state = {
        x: {
          y: 1
        },
        list: [0, 1]
      }
    }

    render() {
      return null
    }
  }

  let instance
  let container

  beforeEach(() => {
    instance = TestUtils.renderIntoDocument(<Test />)
    container = ReactDOM.findDOMNode(instance)
  })

  it('should set works', () => {
    instance.update('set', 'x', null)
    expect(instance.state.x).toBe(null)
  })

  it('should set nested works', () => {
    instance.update('set', ['x', 'y'], 2)
    expect(instance.state.x.y).toBe(2)
  })

  it('should push works', () => {
    instance.update('push', 'list', 2)
    expect(instance.state.list[2]).toBe(2)
  })

  it('should splice works', () => {
    instance.update('splice', 'list', 0)
    expect(instance.state.list.length).toBe(1)
    expect(instance.state.list[0]).toBe(1)
  })

  it('should multiple orders once work', () => {
    instance.update(['set', 'x', 0], ['push', 'list', 2])
    expect(instance.state.x).toBe(0)
    expect(instance.state.list.length).toBe(3)
    expect(instance.state.list[2]).toBe(2)
  })

  it('should multiple calls work', () => {
    instance.update('set', 'x', 0)
    instance.update('push', 'list', 2)
    expect(instance.state.x).toBe(0)
    expect(instance.state.list.length).toBe(3)
    expect(instance.state.list[2]).toBe(2)
  })

  it('should multiple orders on single prop work', () => {
    instance.update(['set', ['x', 'y'], 0], ['set', ['x', 'z'], 0])
    expect(instance.state.x.y).toBe(0)
    expect(instance.state.x.z).toBe(0)
  })

  it('should return works', () => {
    let result
    result = instance.update('set', 'x', 0)
    expect(result).toBe(0)
    result = instance.update(['set', 'x', 0], ['push', 'list', 2])
    expect(result.x).toBe(0)
    expect(result.list.length).toBe(3)
  })
})