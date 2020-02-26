/**
 *
 *
 * @export
 * @param {User._id} modelOne
 * @param {Activity.users} modelTwo
 * @description 这里只是简单的做一下indexOf
 * @description false 表示已有用户 / true 则表示可以进行添加的操作
 */
export async function checkActivityLength(modelOne, modelTwo) {
    if (modelTwo.indexOf(modelOne)) {
    }
    return true
}
