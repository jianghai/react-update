import update from '../src'

describe('update', () => {
  const map = {
    x: {
      y: 1
    },
    list: [0, 1]
  }

  it('should set works', () => {
    const map1 = update(map, 'set', 2, 'x')
    expect(map1.x).toBe(2)
    const map2 = update(map, 'set', 2, ['x', 'y'])
    expect(map2.x.y).toBe(2)
  })

  it('should push works', () => {
    const map1 = update(map, 'push', 2, 'list')
    expect(map1.list[2]).toBe(2)
    const list = update(map.list, 'push', 2)
    expect(list[2]).toBe(2)
  })

  it('should splice works', () => {
    const map1 = update(map, 'splice', 1, 'list')
    expect(map1.list.length).toBe(1)
  })
})