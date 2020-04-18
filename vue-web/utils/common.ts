/**
 *
 * 一个简单的TZ时间过滤
 * @export
 * @param {*} time
 * @returns
 */
export function filterTZTime(time) {
  time = time
    .split('T')
    .join(' ')
    .split('.')[0]
  return time
}
