export function phoneCheck(rule, num, callback) {
  if (num === '' && num === undefined) {
    callback('请输入手机号')
  }
  if (typeof (num) !== 'number') {
    callback('请输入整数')
  }
  if (num.toString().length > 11) {
    callback('请输入正确范围的手机号')
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
  console.log('validator检测:', formName)
  let right = false
  that.$refs[formName].validate((valid) => {
    if (valid) { right = true } else { right = false }
  })
  return right
}
