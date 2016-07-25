import update from 'react-addons-update'

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

export default (source, ...args) => {
  const type = args[0]
  if (typeof type === 'string') {
    return update(source, getTarget.apply(null, args)) 
  } else {
    // Multiple props
    let result = source
    args.forEach(arg => {
      result = update(result, getTarget.apply(null, arg))
    })
    return result
  }
}