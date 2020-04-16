const baseURL = "http://localhost:9528/api"
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

// 通用下载方法
export function download(resource) {
  window.location.href = encodeURI(encodeURI(  "/api/common/download?resource="+resource)) ;
}
