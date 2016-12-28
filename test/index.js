import React, { Component } from 'react'
import TestUtils from 'react-addons-test-utils'
import update from '../src'

describe('pure update', () => {
  it('should set works', () => {
    let result = update({x: 1}, 'set', 'x', 2)
    expect(result.x).toBe(2)
  })
})

describe('update bind to component', () => {

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
    componentDidMount() {
      this.props.onMount && this.props.onMount(this)
    }
    render() {
      return null
    }
  }

  let render

  beforeEach(function() {
    render = onMount => {
      TestUtils.renderIntoDocument(<Test onMount={onMount} />)
    }
  })

  it('should split works', () => {
    render(instance => {
      let result = instance.update('set', 'x.y', 1)
      expect(result.y).toBe(1)
      result = instance.update('set', 'list[0]', 1)
      expect(result[0]).toBe(1)
    })
  })

  it('should set works', () => {
    render(instance => {
      let result = instance.update('set', 'a', 1)
      expect(result).toBe(1)
      result = instance.update('set', ['x', 'y'], 1)
      expect(result.y).toBe(1)
    })
  })

  it('should push works', () => {
    render(instance => {
      let result = instance.update('push', 'list', 1)
      expect(result[1]).toBe(1)
    })
  })

  it('should splice works', () => {
    render(instance => {
      let result = instance.update('splice', 'list', 0)
      expect(result.length).toBe(0)
    })
  })

  it('should multiple props works', () => {
    render(instance => {
      let result = instance.update('set', {
        'x.y': 1,
        'list': 1
      })
      expect(result.x.y).toBe(1)
      expect(result.list).toBe(1)
    })
  })

  it('should return works', () => {
    render(instance => {
      let result = instance.update('set', 'x.y', 1)
      expect(result.y).toBe(1)
    })
  })

  it('should return works with multiple props', () => {
    render(instance => {
      let result = instance.update('set', {
        'x.y': 1,
        'list': 1
      })
      expect(result.x.y).toBe(1)
      expect(result.list).toBe(1)
    })
  })
})