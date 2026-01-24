import './style.scss';

import Intro from "./animations/intro.js"
import Hero from './animations/hero-pin.js';
import About from './animations/about.js';
import TeamPresentation from './animations/teamPresentation.js';
import AboutAnimatedCopy from './animations/animatedText.js';

class App {
    constructor() {
        this._initIntro();
        this._initHero();
        this._initAbout();
        this._initTeamPresentation();
        this._initAboutAnimatedCopy();
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

    _initAboutAnimatedCopy() {
        this.aboutAnimatedCopy = new AboutAnimatedCopy();
    }
}

new App();