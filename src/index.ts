import './style.css'
import {Main} from './main'
import {Intro} from './intro-animation/main'
import { CullFaceNone } from 'three';
import webAudioTouchUnlock from 'web-audio-touch-unlock';

function init() {
	const container = document.getElementById('appContainer');
	const introSceneContainer = document.getElementById('introSceneContainer');
	const introDuration = 10000;

	// @ts-ignore: Unreachable code error
	var context = new (window.AudioContext || window.webkitAudioContext)();

	webAudioTouchUnlock(context)
		.then(function (unlocked) {
			if(unlocked) {
				console.log("need");
				// AudioContext was unlocked from an explicit user action, sound should start playing now
			} else {
				console.log("no need");
				// There was no need for unlocking, devices other than iOS
			}
		}, function(reason) {
			console.error(reason);
		});

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