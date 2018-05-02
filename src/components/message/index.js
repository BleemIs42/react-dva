const id = () => Math.random().toString(32).slice(2)
const createDom = () => {
  const dom = document.createElement('div')
  dom.setAttribute('id', `message-${id()}`)
  dom.style.cssText = `position: fixed;padding: 8px;color: #FFF;border-radius: 5px;text-align: center;
                        background-color: rgb(0,0,0);font: 14px/20px sans-serif;display: block;opacity: 0;
                            z-index: 10000000;max-width: 80%;white-space: nowrap;left: 50%;top: 50%;
                                -webkit-transform: translate(-50%, -50%);
                                    -moz-transform': translate(-50%, -50%);
                                        -ms-transform: translate(-50%, -50%);
                                            -o-transform: translate(-50%, -50%);
                                                transform: translate(-50%, -50%);
                                                    -moz-transition: all 1s;
                                                        -ms-transition: all 1s;
                                                            -webkit-transition: all 1s;
                                                                -o-transition:width all 1s;
                                                                    transition:width all 1s;`
  return dom
}

let timeoutId = null
const fn = (msg, callback, millisecond) => {
  clearTimeout(timeoutId)
  const message = createDom()
  message.innerHTML = msg
  message.style.opacity = '0.7'
  timeoutId = setTimeout(() => {
    message.remove()
    callback && callback()
  }, millisecond || 1500)
  document.body.appendChild(message)
}

export default (msg, callback, millisecond) => {
  fn(msg, callback, millisecond)
}
