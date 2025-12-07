import { Child } from './child.js'

export function mount() {
  const $app = document.querySelector('#app')
  const now = new Date().toLocaleDateString()
  $app.innerHTML = `Hello, it is ${now}\n\n`
  $app.appendChild(Child())
}
