export default class IntroBlock extends HTMLElement {
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
        .intro-block {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: var(--intro-block-background-color, #fff);
          color: var(--intro-block-font-color, #000);
          padding: var(--intro-block-padding, 20px);
          font-family: var(--intro-block-font-family, 'Roboto', sans-serif);
          transition: opacity 0.5s ease-out;
        }
        button {
          padding: var(--button-padding, 10px 20px);
          margin-top: var(--button-margin, 10px);
          cursor: pointer;
          background-color: var(--button-background-color, #007bff);
          color: var(--button-font-color, #fff);
          border: none;
          border-radius: var(--button-border-radius, 4px);
        }
      </style>
      <div class="intro-block">
        <div class="content"></div>
        <button></button>
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
    this.shadowRoot.querySelector('button').addEventListener('click', this.hideIntroBlock);
  }

  hideIntroBlock = () => {
    const introBlock = this.shadowRoot.querySelector('.intro-block');
    const parent = this.parentNode;
    parent.style.pointerEvents = 'none';
    parent.style.display = 'none';
  }

  render() {
    const contentElement = this.shadowRoot.querySelector('.content');
    contentElement.innerHTML = this.props.content || '';

    const buttonElement = this.shadowRoot.querySelector('button');
    buttonElement.textContent = this.props.buttonLabel || 'Start';
  }
}

customElements.define('intro-block', IntroBlock);
