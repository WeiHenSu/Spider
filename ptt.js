var app = new Vue({
    el: '#app',
    data: {
        url_data: []
    },
    mounted(){
        axios.get('http://localhost:3000').then((res) => {
            this.url_data = res.data
        })
    }
});