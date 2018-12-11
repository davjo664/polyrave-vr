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
		introSceneContainer.style.opacity = '0';
		setTimeout(() => {
			intro.destroy();
		}, 3000);
		new Main(container);
		setTimeout(() => {
			container.style.visibility = 'visible';
			container.style.opacity = '1';
		}, 4000);

	}, introDuration);
}

init();