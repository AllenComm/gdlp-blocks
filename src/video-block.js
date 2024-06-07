export default class VideoBlock extends HTMLElement {
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
        .video-block {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: var(--video-block-padding, 10px);
          background-color: var(--video-block-background-color, #000);
        }
        video {
          width: 100%;
          height: 100%;
          object-fit: var(--video-object-fit, cover);
          border-radius: var(--video-border-radius, 4px);
        }
      </style>
      <div class="video-block">
        <video controls>
          <source src="" type="video/mp4">
          Your browser does not support the video tag.
        </video>
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
    const videoSource = this.shadowRoot.querySelector('video source');
    if (videoSource) {
      videoSource.src = this.props.src || '';
      this.shadowRoot.querySelector('video').load();
    }
  }
}

customElements.define('video-block', VideoBlock);
