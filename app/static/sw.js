const staticFiles = [
	'/',
	'/politician-list/senator',
	'/politician-list/federal-deputy',
	'/politician-list/state-deputy',
	'/know-more',
	'/static/css/style.css',
	'/static/libs/jquery-3.3.1.min.js',
	'/static/libs/d3.v3.min.js',
	'/static/js/functions.js',
	'/static/js/script.js',
	//Fonts---------------------------------
	'/static/res/fonts/fonts.css',
	'/static/res/fonts/fonts/AsapBold.eot',
	'/static/res/fonts/fonts/AsapBold.svg',
	'/static/res/fonts/fonts/AsapBold.ttf',
	'/static/res/fonts/fonts/AsapBold.woff',
	'/static/res/fonts/fonts/AsapBold.woff2',
	'/static/res/fonts/fonts/AsapBoldItalic.eot',
	'/static/res/fonts/fonts/AsapBoldItalic.svg',
	'/static/res/fonts/fonts/AsapBoldItalic.ttf',
	'/static/res/fonts/fonts/AsapBoldItalic.woff',
	'/static/res/fonts/fonts/AsapBoldItalic.woff2',
	'/static/res/fonts/fonts/AsapItalic.eot',
	'/static/res/fonts/fonts/AsapItalic.svg',
	'/static/res/fonts/fonts/AsapItalic.ttf',
	'/static/res/fonts/fonts/AsapItalic.woff',
	'/static/res/fonts/fonts/AsapItalic.woff2',
	'/static/res/fonts/fonts/AsapMedium.eot',
	'/static/res/fonts/fonts/AsapMedium.svg',
	'/static/res/fonts/fonts/AsapMedium.ttf',
	'/static/res/fonts/fonts/AsapMedium.woff',
	'/static/res/fonts/fonts/AsapMedium.woff2',
	'/static/res/fonts/fonts/AsapMediumItalic.eot',
	'/static/res/fonts/fonts/AsapMediumItalic.svg',
	'/static/res/fonts/fonts/AsapMediumItalic.ttf',
	'/static/res/fonts/fonts/AsapMediumItalic.woff',
	'/static/res/fonts/fonts/AsapMediumItalic.woff2',
	'/static/res/fonts/fonts/AsapRegular.eot',
	'/static/res/fonts/fonts/AsapRegular.svg',
	'/static/res/fonts/fonts/AsapRegular.ttf',
	'/static/res/fonts/fonts/AsapRegular.woff',
	'/static/res/fonts/fonts/AsapRegular.woff2',
	'/static/res/fonts/fonts/AsapSemiBold.eot',
	'/static/res/fonts/fonts/AsapSemiBold.svg',
	'/static/res/fonts/fonts/AsapSemiBold.ttf',
	'/static/res/fonts/fonts/AsapSemiBold.woff',
	'/static/res/fonts/fonts/AsapSemiBold.woff2',
	'/static/res/fonts/fonts/AsapSemiBoldItalic.eot',
	'/static/res/fonts/fonts/AsapSemiBoldItalic.svg',
	'/static/res/fonts/fonts/AsapSemiBoldItalic.ttf',
	'/static/res/fonts/fonts/AsapSemiBoldItalic.woff',
	'/static/res/fonts/fonts/AsapSemiBoldItalic.woff2',

	//Icons-----------------------------------
	'/static/res/icons/app-icon-96x96.png',
	'/static/res/icons/app-icon-144x144.png',
	'/static/res/icons/app-icon-256x256.png',
	'/static/res/icons/app-icon-512x512.png',
	'/static/res/icons/aprovar_senadores.png',
	'/static/res/icons/avaliar_senadores.png',
	'/static/res/icons/ballon.svg',
	'/static/res/icons/bd_icon.png',
	'/static/res/icons/bolinhas.svg',
	'/static/res/icons/bolinhas_white.svg',
	'/static/res/icons/bolinhas_yellow.svg',
	'/static/res/icons/brasil2.png',
	'/static/res/icons/color_abstain_icon.svg',
	'/static/res/icons/color_no_icon.svg',
	'/static/res/icons/color_secret_icon.svg',
	'/static/res/icons/color_yes_icon.svg',
	'/static/res/icons/dep_estaduais_img.png',
	'/static/res/icons/dep_federais_img.png',
	'/static/res/icons/dropdown_icon.svg',
	'/static/res/icons/estrutura_senado.svg',
	'/static/res/icons/fiscalizar_deputados.png',
	'/static/res/icons/icon.svg',
	'/static/res/icons/icon_y.svg',
	'/static/res/icons/investigar_deputados.png',
	'/static/res/icons/julgar_senadores.png',
	'/static/res/icons/knowMore_img.png',
	'/static/res/icons/knowMore_img3.png',
	'/static/res/icons/mapa_ceara.png',
	'/static/res/icons/next_icon.svg',
	'/static/res/icons/prev_icon.svg',
	'/static/res/icons/propor_deputados.png',
	'/static/res/icons/propor_senadores.png',
	'/static/res/icons/representar_senadores.png',
	'/static/res/icons/senadores_img.png',
	'/static/res/icons/transparente_icon.png',
	'/static/res/icons/user.png',
	'/static/res/icons/white_abstain_icon.svg',
	'/static/res/icons/white_no_icon.svg',
	'/static/res/icons/white_secret_icon.svg',
	'/static/res/icons/white_yes_icon.svg'
	

];

self.addEventListener('install', function(event){
	console.log('SW Installed');

	event.waitUntil(caches.open('static')
		.then(function(cache){
			cache.addAll(staticFiles);
		})
	);

});

self.addEventListener('activate', function(){
	console.log('SW Activated');
});

self.addEventListener('fetch', function(event){
	const req = event.request;

	event.respondWith(
	    caches.match(event.request).then(function(resp) {
	      return resp || fetch(event.request).then(function(response) {
	        return caches.open('dynamic').then(function(cache) {
	          cache.put(event.request, response.clone());
	          return response;
	        });  
	      });
	    })
	);
})

async function cacheFirst(req){
	const cachedResponse = await caches.match(req);
	return cachedResponse || fetch(req);
}
