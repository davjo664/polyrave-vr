import './style.css'
import {Main} from './main'
import {Intro} from './main-intro-scene'
import { CullFaceNone } from 'three';

function init() {
	const container = document.getElementById('appContainer');
	const introSceneContainer = document.getElementById('introSceneContainer');

	new Intro(introSceneContainer);

	setTimeout(() => {
		introSceneContainer.style.display = 'none';
		container.style.visibility = 'visible';
		container.style.opacity = '1';
		new Main(container);
	}, 3000);

}

init();