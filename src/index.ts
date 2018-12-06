import './style.css'
import {Main} from './main'
import {Intro} from './intro-animation/main'
import { CullFaceNone } from 'three';

function init() {
	const container = document.getElementById('appContainer');
	const introSceneContainer = document.getElementById('introSceneContainer');
	const introDuration = 10000;

	const intro = new Intro(introSceneContainer);

	setTimeout(() => {
		intro.destroy();
		new Main(container);
		container.style.visibility = 'visible';
		container.style.opacity = '1';
	}, introDuration);
}

init();