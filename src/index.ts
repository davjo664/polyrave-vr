import './style.css'
import {Main} from './main'
import { CullFaceNone } from 'three';

function init() {
	const container = document.getElementById('appContainer');

	const introSceneContainer = document.getElementById('introSceneContainer');

	setTimeout(() => {
		container.style.display = 'none';
		container.style.visibility = 'hidden';
		container.style.opacity = '0';
		new Main(introSceneContainer);
	}, 3000);

	new Main(container);
}

init();