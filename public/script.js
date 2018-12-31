var PRICE = 9.99;
var LOADNUM = 10;
new Vue({
	el: '#app',

	data: {
		total: 0,
		items: [],
		results: [],
		cart: [],
		newSearch:'anime',
		lastSearch: '',
		loading: false,
		price: PRICE
	},
	methods:{
		appendItens: function(){
			if(this.items.length < this.results.length){
				var append = this.results.slice(this.items.length, this.items.length + LOADNUM);
				this.items = this.items.concat(append);
			}
		},
		onSubmit: function(){
			this.items = [];
			this.loading = true;
			this.$http
			.get('/search/'.concat(this.newSearch))
			.then(function(res){
				// this.items = res.body.slice(0, LOADNUM);
				this.results = res.body;
				this.lastSearch = this.newSearch;
				this.appendItens()
				this.loading = false;
			})
		},

		addItem: function(index){
			this.total += PRICE;
			var item = this.items[index];
			var found = false;
			for(i=0; i<this.cart.length; i++){
				if(this.cart[i].id === item.id){
					found = true;
					this.cart[i].qty++;
					break;
				}
			}
			if(!found){
				this.cart.push({
					id: item.id,
					title:item.title,
					qty: 1,
					price: PRICE
				});				
			}

		},

		inc: function(item){
			item.qty++;
			this.total += PRICE;
		},

		dec: function(item){
			item.qty--;
			this.total -= PRICE;
			if(item.qty<=0){
				for(i=0; i<=this.cart.length; i++){
					if(this.cart[i].id === item.id){
						this.cart.splice(0, 1);
						break;
					}
				}
			}
		}
	},
	filters:{
		currency: function(price){
			return '$'.concat(price.toFixed(2));
		}
	},
	mounted: function(){
		var vueInstance = this;
		this.onSubmit();
		var elem = document.getElementById('product-list-bottom');
		var watcher = scrollMonitor.create(elem);
		watcher.enterViewport(function(){
			console.log('Entered viewport');
			vueInstance.appendItens();
		})
	}
});