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
    instance.update('set', null, 'x')
    expect(instance.state.x).toBe(null)
  })

  it('should set nested works', () => {
    instance.update('set', 2, ['x', 'y'])
    expect(instance.state.x.y).toBe(2)
  })

  it('should push works', () => {
    instance.update('push', 2, 'list')
    expect(instance.state.list[2]).toBe(2)
  })

  it('should splice works', () => {
    instance.update('splice', 0, 'list')
    expect(instance.state.list.length).toBe(1)
    expect(instance.state.list[0]).toBe(1)
  })
})