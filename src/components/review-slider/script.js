window.addEventListener('load', function (event) {

	window.reinit.slider.partnerSlider = function () {

		const options = {
			rootMargin: '100px',
			threshold: 0
		};

		let partnerSlider = document.querySelectorAll('.js-slider-partner');
		let length = partnerSlider[0]?.querySelectorAll('.splide__slide').length;


		if (partnerSlider.length) {

			const initSlider = (el) => {

				partnerSlider.forEach(el => {

					let info = el.querySelector('.splide-info');


					let splide = new Splide(el, {

						speed: 1200,
						lazyLoad: 'sequential',
						pagination: false,
						arrows: true,
						perMove: 1,
						perPage: 4,
						gap: '2.4rem',
						padding: '1rem',
						breakpoints:{
							1024:{
								perPage: 3,
								gap: 16,
								padding: 10
							},
							768:{
								perPage: 2,
								gap: 16
							},
							575:{
								perPage: 1,
								gap: 10,
								autoWidth: true
							},


						}
					});


					splide.mount();

					el?.classList.add('inited');
				});
			};

			partnerSlider.forEach((el) => {
				const observer = new IntersectionObserver((entries, observer) => {
					if (entries[0].isIntersecting && entries[0].target.classList.contains('inited') == false) {
						initSlider(el);
					}
				}, options);
				observer.observe(el);
			});

		}

	};

	// window.reinit.slider.partnerSlider();


})

