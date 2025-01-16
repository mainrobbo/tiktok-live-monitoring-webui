export class PlayPauseElement extends globalThis.HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this!.shadowRoot!.innerHTML = `
        <style>
          :host {
            pointer-events: none;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
          }
  
          :host::before {
            content: 'Paused';
          }
  
          :host([unpaused])::before {
            content: 'Playing';
          }
        </style>
      `
  }

  get paused() {
    return !this.hasAttribute('unpaused')
  }

  play() {
    this.toggleAttribute('unpaused', true)
    this.dispatchEvent(new Event('play'))
    this.dispatchEvent(new Event('playing'))
    return Promise.resolve()
  }

  pause() {
    this.toggleAttribute('unpaused', false)
    this.dispatchEvent(new Event('pause'))
  }
}

if (globalThis.customElements && !globalThis.customElements.get('play-pause')) {
  globalThis.customElements.define('play-pause', PlayPauseElement)
}
