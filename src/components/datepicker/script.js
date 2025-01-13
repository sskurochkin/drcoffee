window.addEventListener('load', function (event) {





});


document.addEventListener('alpine:init', () => {

	Alpine.data('datepicker', (parameters = {}) => ({


		picker: null,
		date: null,
		instance: null,
		isOpen: false,

		init(){
			const _this=this
			this.picker = _this.$refs.picker
			!window.reinit && (window.reinit = {});
			window.reinit.datepicker = () => {
				Datepicker.locales.ru = {
					days: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
					daysShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
					daysMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
					months: ['Январь','Февраль','Март','Апрель','Май','Июнь',
						'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
					monthsShort: ['Янв','Фев','Мар','Апр','Май','Июн',
						'Июл','Авг','Сен','Окт','Ноя','Дек'],
					today: "Сегодня",
					clear: "Очистить",
					titleFormat: "MM y",
					format: "dd/mm/yyyy",
					weekStart: 1

				};

				this.instance = new Datepicker(_this.picker, {
					language: 'ru',
					maxDate: new Date(),
				});


			};
			window.reinit.datepicker();

			this.changeDateListener()

		},

		changeDateListener(){
			this.picker.addEventListener('changeDate', (e)=>{
				const date = this.instance.getDate("dd.mm.yyyy")

				if(date){
					this.date = date
				} else {
					this.date = 'За все время'
				}



			})
		},

		resetPicker(){

			this.instance.setDate({clear: true})
		}


	}));
});