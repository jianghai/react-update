import update from 'react-addons-update'
import warning from 'warning'

function getTarget(type, value, path) {

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

function updateItem(source, target, type, value, path) {
  let prop
  if (typeof path === 'string') {
    prop = path
    path = null
  } else {
    prop = path.shift()
    if (!path.length) path = null
  }
  target[prop] = update(source[prop], getTarget(type, value, path)) 
}

export default function(...args) {

  if (!this) {
    warning(false, 'No `this` bind to update, try `this.update = update.bind(this)` in the constructor.')
    return 
  }
  
  const source = this.state
  const result = {}

  if (typeof args[0] === 'string') {
    args.unshift(source, result)
    updateItem.apply(null, args)
  } else {
    // Multiple props
    args.forEach(arg => {
      arg.unshift(source, result)
      updateItem.apply(null, arg)
    })
  }

  this.setState(result)
  return result
}