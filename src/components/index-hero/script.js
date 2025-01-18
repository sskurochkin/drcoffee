window.addEventListener('load', function (event) {

	!window.reinit && (window.reinit = {})

	window.reinit.heroSlider = function () {

		const options = {
			rootMargin: '100px',
			threshold: 0
		};

		let heroSlider = document.querySelectorAll('.js-slider-hero');

		if (heroSlider.length) {

			const initSlider = (el) => {

				heroSlider.forEach(el => {
					let splide = new Splide(el, {

						lazyLoad: 'sequential',
						pagination: false,
						arrows: true,
						gap: '2rem',
					});


					splide.mount();

					el?.classList.add('inited');
				});
			};

			heroSlider.forEach((el) => {
				const observer = new IntersectionObserver((entries, observer) => {
					if (entries[0].isIntersecting && entries[0].target.classList.contains('inited') == false) {
						initSlider(el);
					}
				}, options);
				observer.observe(el);
			});

		}

	};

	window.reinit.heroSlider();


})

