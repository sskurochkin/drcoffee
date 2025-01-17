window.addEventListener('load', function () {
    const fields = document.querySelectorAll('.form-control')

	fields.forEach(el=>el.addEventListener('blur', ()=>{

		if(el.value.length){
			el.classList.add('dirty')
		}else{
			el.classList.remove('dirty')
		}

	}))
})

document.addEventListener('alpine:init', () => {
    // function addRemove() {
    //     return {
    //         fields: [],
    //         addNewField() {
    //             this.fields.push({id: new Date().getTime() + this.fields.length});
    //         },
    //         removeField(field) {
    //             this.fields.splice(this.fields.indexOf(field), 1);
    //         }
    //     }
    // }
});

