import './style.scss';

import Intro from "./animations/intro.js"
import Hero from './animations/hero-pin.js';
import About from './animations/about.js';
import TeamPresentation from './animations/teamPresentation.js';

class App {
    constructor() {
        this._initIntro();
        this._initHero();
        this._initAbout();
        this._initTeamPresentation();
    }

    _initIntro() {
        this.intro = new Intro();
    }

    _initHero() {
        this.hero = new Hero();
    }

    _initAbout() {
        this.about = new About();
    }

    _initTeamPresentation() {
        this.teamPresentation = new TeamPresentation();
    }
}

new App();