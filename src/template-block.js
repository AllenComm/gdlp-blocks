// /components/template-block.js

export default class TemplateBlock extends HTMLElement {
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
          .template-block {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: var(--padding, 16px);
            font-family: var(--font-family, 'Roboto', sans-serif);
            font-size: var(--font-size, 1rem);
            color: var(--primary-color, #000);
            background-color: var(--secondary-color, #fff);
          }
          /* Additional component-specific styles go here */
        </style>
        <div class="template-block" role="region" aria-label="Template Block">
          <!-- Content goes here -->
        </div>
      `;
    }
  
    // Expected data format: { content: "HTML content or text", additionalProp: "value" }
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
      // Implement how data should be displayed
      const contentElement = this.shadowRoot.querySelector('.template-block');
      contentElement.innerHTML = this.props.content || '';
      // Handle additional properties
      if (this.props.additionalProp) {
        // Implement handling of additionalProp
      }
    }
  }
  
  customElements.define('template-block', TemplateBlock);
  