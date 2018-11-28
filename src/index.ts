import './style.css'
import {Main} from './main'
import {Intro} from './intro-main' 

function init() {
	let introSceneContainer = document.getElementById('introSceneContainer');
	new Intro(introSceneContainer);

	
	let container = document.getElementById('appContainer');
	//new Main(container);

	setTimeout(() => {
		console.log('intro done.');

		// Fade scenes
		introSceneContainer.style.display = 'none';
		container.style.visibility = 'visible';
		container.style.opacity = '1';

		new Main(container);
	}, 3000);
	
}

init();