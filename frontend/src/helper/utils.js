//check object values is non empty
export const strictNonEmptyObjectValues = (obj) => {
  if (obj && typeof obj === 'object') {
    let isValid = true
    Object.keys(obj).map((key) => {
      if (!obj[key]) isValid = false
    })
    return isValid
  } else return false
}
