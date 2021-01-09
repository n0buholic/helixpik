const request = require('request');

let url = 'https://jsonplaceholder.typicode.com/todos/1';
let options = {json: true};
//var jsonObj = JSON.parse(url);



request(url, options, (error, res, body) => {
    if (content.id > 50) { //apply the condition
        content.id = "high";
    }
    else {
        content.id = "low";
    }
    context.setVariable("response.content", JSON.stringify(content)); //set it back on the response
});

