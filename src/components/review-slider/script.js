window.addEventListener('load', function (event) {

	!window.reinit && (window.reinit = {})

	window.reinit.reviewSlider = function () {

		const options = {
			rootMargin: '100px',
			threshold: 0
		};

		let reviewSlider = document.querySelectorAll('.js-slider-review');
		let length = reviewSlider[0]?.querySelectorAll('.splide__slide').length;


		if (reviewSlider.length) {

			const initSlider = (el) => {

				reviewSlider.forEach(el => {
					let splide = new Splide(el, {

						lazyLoad: 'sequential',
						pagination: false,
						arrows: true,
						perMove: 1,
						perPage: 3,
						gap: '2rem',
						breakpoints:{
							980:{
								autoWidth: true,
								gap: 16,
							},
						}
					});


					splide.mount();

					el?.classList.add('inited');
				});
			};

			reviewSlider.forEach((el) => {
				const observer = new IntersectionObserver((entries, observer) => {
					if (entries[0].isIntersecting && entries[0].target.classList.contains('inited') == false) {
						initSlider(el);
					}
				}, options);
				observer.observe(el);
			});

		}

	};

	window.reinit.reviewSlider();


})

