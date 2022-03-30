
var app = new Vue({
    el: '#app',
    data: {
        url_data: []
    },
    created: function(){
        this.getData();
    },
    methods: {
        getData: function(){
            var apiURL = 'http://localhost:3000/';
            var xhr = new XMLHttpRequest();
            var self = this;
            xhr.open('GET', apiURL);
            console.log(xhr.open('GET', apiURL));
            xhr.onload = function(){
                self.url_data = JSON.parse(xhr.responseText);
                console.log(self.url_data.html_url)
                
            }
            xhr.send()
        },
        
    }
});