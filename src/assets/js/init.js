const uiInits = {
	init: function () {
		this.browserCheck();
		this.vendorLoader();
		this.scrollWidth();
		// this.btnWave();
	},

	browserCheck: function () {
		// проверка браузера
		const userAgent = navigator.userAgent;
		if (userAgent.indexOf("Firefox") > -1) {
			// "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
			document.querySelector('body').classList.add('browser-mozzila');
		} else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
			//"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
			document.querySelector('body').classList.add('browser-opera');
		} else if (userAgent.indexOf("Trident") > -1) {
			// "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
			document.querySelector('body').classList.add('browser-ie');
		} else if (userAgent.indexOf("Edge") > -1) {
			// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
			document.querySelector('body').classList.add('browser-edge');
		} else if (userAgent.indexOf("Chrome") > -1) {
			// "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
			document.querySelector('body').classList.add('browser-chrome');
		} else if (userAgent.indexOf("Safari") > -1) {
			// "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
			document.querySelector('body').classList.add('browser-safari');
		}
		// проверка на МАС платформу
		if (navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
			document.querySelector('body').classList.add('platform-mac');
		}
	},
	vendorLoader: function () {
		window.vendorLoader = class VendorLoader {

			static resources = new Map();

			static add(source, options, callback = undefined) {

				const { key, pathes } = VendorLoader.getType(source);

				if (VendorLoader.resources.get(key)) return;

				const target = document.querySelector(options.target);

				VendorLoader.resources.set(key, {
					isLoaded: false,
					options,
					pathes,
					callback,
				})

				function handler() {
					removeEventListeners();
					VendorLoader.loadSources(key)
				}

				function removeEventListeners() {
					document.removeEventListener('scroll', handler);
					if (options.click) {
						target && target.removeEventListener('click', handler)
					}
					if (options.mouseover) {
						target && target.removeEventListener('mouseover', handler)
					}
					if (options.timeout && options.timeoutRef) {
						clearTimeout(options.timeoutRef);
					}
				}

				if (!options.immediately) {
					if (options.scroll) {
						document.addEventListener('scroll', handler)
						if(window.pageYOffset > 200){
							setTimeout(handler)
						}
					}

					if (options.click) {
						target && target.addEventListener('click', handler)
					}

					if (options.mouseover) {
						target && target.addEventListener('mouseover', handler)
					}

					if (options.timeout >= 0 && options.timeout !== undefined) {
						options.timeoutRef = setTimeout(() => {
							handler();
						}, options.timeout)
					}

					if (options.visor) {
						handler();
					}
				}else{
					handler();
				}




			}

			static getType(source) {
				if (Array.isArray(source)) {
					return {
						key: source.join(''),
						pathes: source
					}

				}
				if (typeof source === 'string') {
					return {
						key: source,
						pathes: [source]
					}

				}
			}

			static loadSources(key) {

				const resource = VendorLoader.resources.get(key);

				const { pathes,
					options: {
						type,
						method = 'GET',
						data = {},
						headers = { 'Content-Type': 'application/json;charset=utf-8' }
					}
				} = resource;

				const requests = [];

				if (!type) {
					console.warn('define type of resource for vendorLoader')
				}

				switch (type) {
					case 'script':
						pathes.map(x => {
							requests.push(new Promise((resolve, reject) => {
								const scriptTag = document.createElement('script');
								const firstScriptTag = document.getElementsByTagName('script')[0];
								scriptTag.src = x;
								firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
								scriptTag.onload = () => {
									resolve();
								}
							}))
						})
						break;
					case 'module':
						pathes.map(x => {
								requests.push(new Promise((resolve, reject) => {
									import(x)
										.then(_ => resolve())
										.catch(_ => reject(_))
								}))
							}
						);
						break;
					case 'metrics':
						pathes.map(x => {
								requests.push(new Promise((resolve, reject) => {
									fetch(x, {
										method,
										headers,
										body: data
									})
										.then(x => x.json())
										.then(x => resolve(x.data.html))
								}))
							}
						);
						break;
					default:
						break;
				}


				Promise.all(requests)
					.then(_ => {
						resource.isLoaded = true;
						document.dispatchEvent(new Event('vendorLoader.' + key));
						resource.callback && resource.callback(_);
					})
					.catch(error => {
						console.log(`something went wrong with resource => ${key, error}`)
					})
			}

			static decodeParams(params) {
				const result = []
				for (var i in params) {
					result.push({ name: i, value: params[i] });
				}
				const paramsEncoded = result.map(x => `${encodeURI(x.name)}=${encodeURI(x.value)}`).join('&');
				return paramsEncoded;
			}

			static insertScript(html) {
				const target = document.createElement('div');
				target.insertAdjacentHTML("beforeend", html);
				var scripts = target.getElementsByTagName("script");
				while (scripts.length) {
					var script = scripts[0];
					script.parentNode.removeChild(script);
					var newScript = document.createElement("script");
					if (script.src) {
						newScript.src = script.src;
					} else if (script.textContent) {
						newScript.textContent = script.textContent;
					} else if (script.innerText) {
						newScript.innerText = script.innerText;
					}
					document.body.appendChild(newScript);
				}
			}

		}
	},

	scrollWidth: function () {
		if (document.body.scrollHeight <= window.innerHeight) {
			document.documentElement.style.setProperty('--scrollWidth', 0 + 'px');
		} else {
			let div = document.createElement('div');

			div.style.overflowY = 'scroll';
			div.style.width = '50px';
			div.style.height = '50px';

			// мы должны вставить элемент в документ, иначе размеры будут равны 0
			document.body.append(div);
			let scrollWidth = div.offsetWidth - div.clientWidth;

			div.remove();
			document.documentElement.style.setProperty('--scrollWidth', scrollWidth + 'px');
		}
	},
	btnWave: function () {
		const btns = document.querySelectorAll('.btn-wave');

		btns.forEach(el => {
			el.addEventListener('mouseenter', function(e) {
				let
					size = Math.max(this.offsetWidth, this.offsetHeight),
					x = e.offsetX - size / 2,
					y = e.offsetY - size / 2,
					wave = this.querySelector('.wave')

				// Create an element if it doesn't exist
				if (!wave) {
					wave = document.createElement('span');
					wave.classList.add('wave');
				}
				wave.style.cssText = `width:${size}px;height:${size}px;top:${y}px;left:${x}px`
				this.appendChild(wave)
			});
		})
	},
};

export default uiInits
