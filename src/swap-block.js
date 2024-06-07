// /components/swap-block.js

export default class SwapBlock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.props = { items: [] };
    this.eventListeners = []; // Track event listeners for cleanup
    this.shadowRoot.innerHTML = `
      <style>
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        .swap-block {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }
        button {
          padding: var(--button-padding, 10px 20px);
          margin: var(--button-margin, 10px);
          cursor: pointer;
        }
        .content {
          display: none;
        }
        .content.active {
          display: block;
        }
      </style>
      <div class="swap-block">
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

  disconnectedCallback() {
    this.cleanupEventListeners();
  }

  cleanupEventListeners() {
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }

  handleButtonClick = (event) => {
    const index = event.target.getAttribute('data-index');
    const contentElements = this.shadowRoot.querySelectorAll('.content');
    contentElements.forEach(content => content.classList.remove('active'));
    this.shadowRoot.querySelector(`.content[data-index="${index}"]`).classList.add('active');

    // Update aria-expanded attributes for accessibility
    const buttonElements = this.shadowRoot.querySelectorAll('button');
    buttonElements.forEach(button => {
      button.setAttribute('aria-expanded', button.getAttribute('data-index') === index);
    });
  }

  render() {
    const container = this.shadowRoot.querySelector('.swap-block');
    container.innerHTML = '';

    const buttons = this.props.items.map((item, index) => `
      <button data-index="${index}" aria-controls="content-${index}" aria-expanded="false">
        ${item.header}
      </button>`).join('');

    container.innerHTML = buttons;

    this.props.items.forEach((item, index) => {
      const contentDiv = document.createElement('div');
      contentDiv.id = `content-${index}`;
      contentDiv.classList.add('content');
      contentDiv.setAttribute('data-index', index);
      contentDiv.setAttribute('role', 'region');
      contentDiv.setAttribute('aria-hidden', 'true');
      contentDiv.innerHTML = item.body;
      container.appendChild(contentDiv);
    });

    const buttonElements = container.querySelectorAll('button');
    const contentElements = container.querySelectorAll('.content');

    // Cleanup old event listeners
    this.cleanupEventListeners();

    buttonElements.forEach(button => {
      const handler = this.handleButtonClick.bind(this);
      button.addEventListener('click', handler);
      this.eventListeners.push({ element: button, event: 'click', handler });
    });
  }
}

customElements.define('swap-block', SwapBlock);
