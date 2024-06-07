export default class CounterBlock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = { count: 0 };
    this.props = {};
    this.shadowRoot.innerHTML = `
      <style>
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        .counter-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: var(--counter-block-background-color, #fff);
          padding: var(--counter-block-padding, 10px);
          border-radius: var(--counter-block-border-radius, 4px);
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
        #count-display {
          font-size: var(--counter-font-size, 1.2rem);
          color: var(--counter-font-color, #333);
        }
      </style>
      <div class="counter-block" role="region" aria-label="Counter Block">
        <p id="count-display">Count: 0</p>
        <button id="increment-button">Increment</button>
      </div>
    `;
  }

  set data(props) {
    this.props = props;
    if (typeof props.count === 'number') {
      this.state.count = props.count;
    }
    this.render();
  }

  get data() {
    return this.props;
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector('#increment-button').addEventListener('click', this.handleButtonClick);
    window.addEventListener('datatracking', this.handleDataTrackingEvent);
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('#increment-button').removeEventListener('click', this.handleButtonClick);
    window.removeEventListener('datatracking', this.handleDataTrackingEvent);
  }

  handleButtonClick = () => {
    this.state.count += 1;
    this.render();
    this.trackData();
  }

  handleDataTrackingEvent = (event) => {
    if (event.detail && event.detail.customData && typeof event.detail.customData.count !== 'undefined') {
      this.state.count = event.detail.customData.count;
      this.render();
    }
  }

  trackData() {
    window.datatracking?.setCustomData({ count: this.state.count });
  }

  render() {
    this.shadowRoot.querySelector('#count-display').textContent = `Count: ${this.state.count}`;
  }
}

customElements.define('counter-block', CounterBlock);
