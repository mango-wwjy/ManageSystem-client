/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}


/*判断输入的EMAIL格式是否正确 */
export function validateIsEmail(str) {
  if (str.length != 0) {
    const reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
    return reg.test(str);
  }
}


/*判断输入的手机号格式是否正确 */
export function validateIsPhone(str) {
  if (str.length != 0) {
    const reg = /^1[0-9]{10}$/;
    return reg.test(str);
  }
}
