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
          y: 0
        },
        list: [0]
      }
    }

    componentWillMount() {
      this.props.update && this.props.update(this)
    }

    render() {
      return null
    }
  }

  function render(update) {
    return TestUtils.renderIntoDocument(<Test update={update} />)
  }

  it('should split works', () => {
    const { state } = render(instance => {
      instance.update('set', 'x.y', 1)
      instance.update('set', 'list[0]', 1)
    })
    expect(state.x.y).toBe(1)
    expect(state.list[0]).toBe(1)
  })

  it('should set works', () => {
    const { state } = render(instance => {
      instance.update('set', 'a', 1)
      instance.update('set', ['x', 'y'], 1)
    })
    expect(state.a).toBe(1)
    expect(state.x.y).toBe(1)
  })

  it('should push works', () => {
    const { state } = render(instance => {
      instance.update('push', 'list', 1)
    })
    expect(state.list[1]).toBe(1)
  })

  it('should splice works', () => {
    const { state } = render(instance => {
      instance.update('splice', 'list', 0)
    })
    expect(state.list.length).toBe(0)
  })

  it('should multiple props works', () => {
    const { state } = render(instance => {
      instance.update(['set', ['x', 'y'], 1], ['push', 'list', 1])
    })
    expect(state.x.y).toBe(1)
    expect(state.list[1]).toBe(1)
  })


  it('should multiple calls saved', () => {
    const { state } = render(instance => {
      instance.update('set', ['x', 'y'], 1)
      instance.update('set', ['x', 'z'], 1)
      instance.update('push', 'list', 1)
      instance.update('push', 'list', 1)
    })
    expect(state.x.y).toBe(1)
    expect(state.x.z).toBe(1)
    expect(state.list[1]).toBe(1)
    expect(state.list[2]).toBe(1)
  })

  it('should return works', () => {
    render(instance => {
      const x = instance.update('set', ['x', 'y'], 1)
      expect(x.y).toBe(1)
    })
  })

  it('should return works which multiple orders passed', () => {
    render(instance => {
      const result = instance.update(['set', ['x', 'y'], 1], ['push', 'list', 1])
      expect(result.x.y).toBe(1)
      expect(result.list[1]).toBe(1)
    })
  })

  it('should return works which multiple orders passed on single prop', () => {
    render(instance => {
      const x = instance.update(['set', ['x', 'y'], 1], ['set', ['x', 'z'], 1])
      expect(x.y).toBe(1)
      expect(x.z).toBe(1)
    })
  })

  it('should return saved which multiple calls on single single prop', () => {
    render(instance => {

      instance.update('set', ['x', 'y'], 1)
      const x = instance.update('set', ['x', 'z'], 1)
      expect(x.y).toBe(1)
      expect(x.z).toBe(1)

      instance.update('push', 'list', 1)
      const list = instance.update('push', 'list', 1)
      expect(list[1]).toBe(1)
      expect(list[2]).toBe(1)
    })
  })
})