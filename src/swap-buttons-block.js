
  export default class SwapButtonsBlock extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.props = {};
      this.shadowRoot.innerHTML = `
        <style>
          .swap-buttons-block {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: var(--swap-buttons-block-padding, 10px);
            background-color: var(--swap-buttons-block-background-color, #fff);
          }
          button {
            margin: var(--button-margin, 5px);
            padding: var(--button-padding, 10px 20px);
            cursor: pointer;
            background-color: var(--button-background-color, #007bff);
            color: var(--button-font-color, #fff);
            border: none;
            border-radius: var(--button-border-radius, 4px);
          }
        </style>
        <div class="swap-buttons-block"></div>
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
      const container = this.shadowRoot.querySelector('.swap-buttons-block');
      container.innerHTML = '';

      if (this.props.buttons) {
        this.props.buttons.forEach((buttonText, index) => {
          const button = document.createElement('button');
          button.textContent = buttonText;
          button.addEventListener('click', () => this.handleButtonClick(index));
          container.appendChild(button);
        });
      }
    }

    handleButtonClick(index) {
      this.trackData(this.props.guid, index);

      // Dispatch custom event to notify SwapTextBlock
      const event = new CustomEvent('swap-update', {
        detail: { linkedGuid: this.props.guid, activeIndex: index },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);
    }

    trackData(guid, index) {
      const customData = { [guid]: index };
      if (window.datatracking && typeof window.datatracking.setCustomData === 'function') {
        window.datatracking.setCustomData(customData);
      }
    }
  }

  customElements.define('swap-buttons-block', SwapButtonsBlock);
