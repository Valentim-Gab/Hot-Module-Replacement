if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      console.log(`Handling hot reload accept for ${import.meta.url}`)
      document.querySelector('#child2').replaceWith(newModule.Child2())
    }
  })
}

/** @param {HTMLElement} parent */
export function Child2() {
  const $el = document.createElement('div')
  $el.id = 'child2'
  $el.textContent = `Teste de HMRt 45`
  return $el
}

