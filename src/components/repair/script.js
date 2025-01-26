document.addEventListener('alpine:init', () => {

	Alpine.data('repair', (items = {}) => ({
		items: [],
		query: '',
		filteredItems : [],


		init() {
			this.items = items
			this.filteredItems = this.items
		},


		search(){
			const query = this.query
			let arr
			if(query.length > 2){
				arr = this.items.filter(x=>x.brand.toLowerCase().includes(query.toLowerCase()))
			}else {arr = this.items}

			this.filteredItems = arr
		},

		clear(){
			this.query = ''
		}



	}));
});