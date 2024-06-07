export default class TextBlock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.props = {};
    this.shadowRoot.innerHTML = `
      <style>
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        .text-block {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: var(--text-block-padding, 16px);
          font-family: var(--text-block-font-family, 'Roboto', sans-serif);
          font-size: var(--text-block-font-size, 1rem);
          color: var(--text-block-font-color, #000);
          background-color: var(--text-block-background-color, #fff);
        }
      </style>
      <div class="text-block" role="region" aria-label="Text Block">
        <p id="text-content"></p>
      </div>
    `;
  }

  set data(value) {
    this.props = value;
    this.render();
  }

  get data() {
    return this.props;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const textContent = this.shadowRoot.querySelector('#text-content');
    textContent.innerHTML = this.props.content || '';
    textContent.setAttribute('aria-live', 'polite'); // Announce changes to screen readers
  }
}

customElements.define('text-block', TextBlock);
