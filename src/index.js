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

export default function(...args) {

  if (!this) {
    warning(false, 'No `this` bind to update, try `this.update = update.bind(this)` in the constructor.')
    return 
  }
  
  const source = this.state
  const type = args[0]
  let result

  if (typeof type === 'string') {
    result = update(source, getTarget.apply(null, args)) 
  } else {
    // Multiple props
    let result = source
    args.forEach(arg => {
      result = update(result, getTarget.apply(null, arg))
    })
  }

  this.setState(result)
}