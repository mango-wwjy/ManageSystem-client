/**
 * @return {string}
 */
export function GetUrlRelativePath(url) {
  let arrUrl = url.split('//')

  let start = arrUrl[1].indexOf('/')
  let relUrl = arrUrl[1].substring(start)

  if (relUrl.indexOf('?') !== -1) {
    relUrl = relUrl.split('?')[0]
  }
  return relUrl
}
