import './style.scss';

import Intro from "./animations/intro.js"

class App {
    constructor() {
        this._initIntro();
    }

    _initIntro() {
        this.intro = new Intro();
    }
}

new App();