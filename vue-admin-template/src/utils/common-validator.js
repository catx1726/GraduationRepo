/**
 *
 *
 * @export
 * @param {*} rule
 * @param {*} val
 * @param {*} callback
 */
export function genderCheck(rule, val, callback) {
  if (val !== '男' && val !== '女') {
    callback('请选择正确的性别')
  }
  callback()
}

/**
 *
 *
 * @export
 * @param {*} rule
 * @param {*} num
 * @param {*} callback
 * @param {*} source
 */
export function phoneCheck(rule, num, callback, source) {
  if (num === '' || num === undefined) {
    callback('请输入手机号')
  }
  if (num.length > 12) {
    callback('请输入正确范围的手机号')
  }
  if (!/0?(13|14|15|18|17)[0-9]{9}/.test(num)) {
    callback('请输入正确的手机号')
  }
  callback() // 之前这里掉了callback()，下面的 validator 就一直是 false
}

/**
 *
 *
 * @export
 * @param {*} rule
 * @param {*} num
 * @param {*} callback
 * @param {*} source
 */
export function identifierCheck(rule, num, callback, source) {
  if (num === '' || num === undefined) {
    callback('请输入身份证号')
  }
  if (!/\d{17}[\d|x]|\d{15}/.test(num)) {
    callback('请输入正确格式的身份证号')
  }
  if (num.toString().length > 18) {
    callback('请输入正确范围的身份证号')
  }
  callback() // 之前这里掉了callback()，下面的 validator 就一直是 false
}

/**
 * DES 就是对 validator 的验证流程再一次封装
 * @export
 * @param {string} formName
 * @param {that} content
 * @returns {boolean}
 */
export function cadValidator(formName, that) {
  console.log('validator检测:', formName, that)
  let right = false
  that.$refs[formName].validate((valid) => {
    if (valid) {
      right = true
    } else {
      right = false
    }
  })
  return right
}

/**
 *
 * DES 就是对 TZ 时间的一个过滤
 * @export
 * @param {*} list
 * @returns
 */
export function dateTZFilter(list) {
  list.forEach((item) => {
    item.createdAt = item.createdAt
      .split('T')
      .join(' ')
      .split('.')[0]
  })
  return list
}
