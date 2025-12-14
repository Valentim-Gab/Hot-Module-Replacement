class HotModule {
  file
  cb

  constructor(file) {
    this.file = file
  }

  /**
   * Registra um callback para quando o módulo for atualizado
   * O callback recebe o novo módulo como argumento
   * Utilizado dentro dos módulos JS para lidar com atualizações HMR  
  **/
  accept(cb) {
    this.cb = cb
  }

  /**
   * Lida com a aceitação de uma atualização de módulo
   * Recarrega o módulo atualizado e chama o callback registrado
  **/
  handleAccept() {
    if (!this.cb) {
      return
    }

    import(`${this.file}?t=${Date.now()}`).then((newMod) => {
      this.cb(newMod)
    })
  }
}

/**
 * Inicializa o HMR para o módulo fornecido
 * Cria uma instância de HotModule e a associa ao módulo
 * Chamado automaticamente no início de cada arquivo JS servido pelo servidor HMR
**/
function hmrClient(mod) {
  const url = new URL(mod.url)
  const hot = new HotModule(url.pathname)
  import.meta.hot = hot

  /* Registra o módulo na coleção global de módulos HMR */
  window.hotModules.set(url.pathname, hot)
}

/** @type {Map<string, HotModule>} */
window.hotModules ??= new Map()

window.ws

if (!window.ws) {
  const ws = new window.WebSocket(`ws://localhost:8080`)

  /**
   * Lidar com mensagens do servidor WebSocket
   * Quando um arquivo é alterado, o servidor envia uma mensagem com o caminho do arquivo
   * O cliente procura o módulo correspondente e chama handleAccept para recarregá-lo
  **/
  ws.addEventListener('message', (msg) => {
    const data = JSON.parse(msg.data)
    const mod = window.hotModules.get(data.file)

    mod.handleAccept()
  })

  window.ws = ws
}
