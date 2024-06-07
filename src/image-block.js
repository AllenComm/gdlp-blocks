export default class ImageBlock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.props = { src: '', alt: '' };
    this.shadowRoot.innerHTML = `
      <style>
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        .image-block {
          width: var(--image-block-width, 100%);
          height: var(--image-block-height, 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--image-block-background-color, #fff);
          padding: var(--image-block-padding, 10px);
          border-radius: var(--image-block-border-radius, 4px);
          pointer-events: none;
        }
        img {
          max-width: 100%;
          max-height: 100%;
          border-radius: var(--image-border-radius, 4px);
        }
      </style>
      <div class="image-block">
        <img src="" alt="">
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
    const imgElement = this.shadowRoot.querySelector('img');
    imgElement.src = this.props.src || '';
    imgElement.alt = this.props.alt || '';
  }
}

customElements.define('image-block', ImageBlock);
