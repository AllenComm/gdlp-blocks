export default class LayeredImage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.SENSOR_MAX = 12;
        this.SENSOR_THRESHOLD = 4;
        this.SENSOR_SCALER = 50;
        this.shiftX = 0;
        this.shiftY = 0;
        this.props = {};
    }

    connectedCallback() {
        this.render();
        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("scroll", this.handleScroll);
        this.requestMotionPermission();
    }

    disconnectedCallback() {
        window.removeEventListener("mousemove", this.handleMouseMove);
        window.removeEventListener("devicemotion", this.handleDeviceMotion);
        window.removeEventListener("scroll", this.handleScroll);
    }

    get data() {
        return this.props;
    }

    set data(value) {
        this.props = value;
        this.render();
    }

    requestMotionPermission = () => {
        alert("requestMotionPermission called");
        if (typeof DeviceMotionEvent?.requestPermission === 'function') {
            alert("DeviceMotionEvent.requestPermission is a function");
            DeviceMotionEvent.requestPermission().then(permissionState => {
                alert(`DeviceMotionEvent.requestPermission called: ${permissionState}`);
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', this.handleDeviceMotion);
                }
            }).catch(console.error);
        } else {
            alert("DeviceMotionEvent.requestPermission is not a function");
            window.addEventListener('devicemotion', this.handleDeviceMotion);
        }
    }

    rotate = () => {
        const x = this.shiftX;
        const y = this.shiftY;
        const animate = x == 0 && y == 0;

        const wrapper = this.shadowRoot.querySelector('#wrapper');
        wrapper.style.transform = `perspective(${this.props.perspective}px) rotateX(${x}deg) rotateY(${y}deg)`;
        wrapper.style.transition = `${animate ? "transform .3s ease" : "all 0s ease 0s"}`;

        const images = this.shadowRoot.querySelectorAll('img');
        images.forEach((a, i) => {
            const z = (i * this.props.spacing) + this.props.initialDepth;
            a.style.transform = `perspective(${this.props.perspective}px) rotateX(${x}deg) rotateY(${y}deg) translateZ(${(z)}px)`;
            a.style.transition = `${animate ? "transform .3s ease" : "all 0s ease 0s"}`;
        });
    }

    handleDeviceMotion = (e) => {
        alert(`handleDeviceMotion called: ${JSON.stringify(e.rotationRate)}`);
        const rotation = e.rotationRate || {};
        if (Math.abs(rotation.alpha) > this.SENSOR_THRESHOLD || Math.abs(rotation.beta) > this.SENSOR_THRESHOLD) {
            const x = -(rotation.alpha || 0) / this.SENSOR_SCALER;
            const y = (rotation.beta || 0) / this.SENSOR_SCALER;
            this.shiftX = Math.min(Math.max(this.shiftX + x, -this.SENSOR_MAX), this.SENSOR_MAX);
            this.shiftY = Math.min(Math.max(this.shiftY + y, -this.SENSOR_MAX), this.SENSOR_MAX);
            this.rotate();
        }
    }

    handleMouseMove = (e) => {
        const x = e.pageX - this.offsetLeft;
        const y = e.pageY - this.offsetTop;
        const { width } = this.getBoundingClientRect();
        this.shiftX = (0.5 - (y / width)) * this.props.multiplier;
        this.shiftY = -(0.5 - (x / width)) * this.props.multiplier;
        this.rotate();
    }

    handleScroll = () => {
        this.rotate();
    }

    render = () => {
        this.shadowRoot.innerHTML = `
            <style>
                *, *::before, *::after {
                    box-sizing: border-box;
                    pointer-events: none;
                    user-select: none;
                }
                #wrapper {
                    background-color: white;
                    border-radius: ${this.props.borderRadius};
                    box-shadow: ${this.props.boxShadow};
                    clip-path: ${this.props.clipPath};
                    height: 100%;
                    width: 100%;
                }
                #images {
                    background: ${this.props.background};
                    border-radius: ${this.props.borderRadius};
                    clip-path: inherit;
                    height: calc(100% - calc(${this.props.borderWidth} * 2));
                    left: ${this.props.borderWidth};
                    overflow: ${this.props.overflow};
                    position: relative;
                    top: ${this.props.borderWidth};
                    width: calc(100% - calc(${this.props.borderWidth} * 2));
                }
                img {
                    left: 0;
                    position: absolute;
                    top: 0;
                    width: 100%;
                }
            </style>
            <div id="wrapper">
                <div id="images">
                    ${this.props?.images?.map(a => `<img src="${a}"></img>`).join('')}
                </div>
            </div>
        `;
        this.rotate();
    }
}

customElements.define('gdlp-layered-image', LayeredImage);
