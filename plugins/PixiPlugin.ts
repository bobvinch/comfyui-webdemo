import {Application} from 'pixi.js';


export default defineNuxtPlugin((nuxtAPP) => {
    const pixiApp = new Application();
    return {
        provide: {
            pixiApp: pixiApp,
        }
    }

})