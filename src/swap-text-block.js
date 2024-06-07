
  export default class SwapTextBlock extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.props = {};
      this.shadowRoot.innerHTML = `
        <style>
          .swap-text-block {
            display: none;
            padding: var(--swap-block-padding);
            margin: var(--swap-block-margin);
            border-radius: var(--swap-block-border-radius);
            background-color: var(--swap-block-inactive-color);
          }
          .swap-text-block.active {
            display: block;
            background-color: var(--swap-block-active-color);
          }
        </style>
        <div class="swap-text-blocks"></div>
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
      window.addEventListener('swap-update', this.handleSwapUpdate.bind(this));
    }
    
    disconnectedCallback() {
      window.removeEventListener('swap-update', this.handleSwapUpdate.bind(this));
    }

    handleSwapUpdate(event) {
      const { linkedGuid, activeIndex } = event.detail;
      if (this.props.linkedGuid === linkedGuid) {
        this.render(activeIndex);
      }
    }
    
    render(activeIndex = null) {
      const container = this.shadowRoot.querySelector('.swap-text-blocks');
      container.innerHTML = '';

      if (!Array.isArray(this.props.textBlocks)) {
        console.error('textBlocks is not an array or is undefined:', this.props.textBlocks);
        return;
      }

      this.props.textBlocks.forEach((block, index) => {
        const div = document.createElement('div');
        div.classList.add('swap-text-block');
        if (index === activeIndex || index === window.datatracking?.data?.customData?.[this.props.linkedGuid]) {
          div.classList.add('active');
        }
        div.innerHTML = block;
        container.appendChild(div);
      });
    }
  }

  customElements.define('swap-text-block', SwapTextBlock);
