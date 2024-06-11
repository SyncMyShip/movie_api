const http = require('http'),
    fs = require('fs')

// create server that listens on port 8081
http.createServer((request, response) => {


    // parse incoming requests for the word "documentation"
    // navigate to documentation.html if true, home page if false
    let addr = request.url;
    q = new URL(addr, 'http://' + request.headers.host)

    if (q.pathname.includes('documentation')) {
    var filePath = (__dirname + '/documentation.html');
    } else {
    filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write(data);
        response.end('\n\nThanks for connecting!');
    })

    // log both request URL and a timestamp to log.txt
    fs.appendFile('log.txt', 'Timestamp: ' + new Date() + '\nURL: ' + addr + '\nStatus Code: ' + response.statusCode + '\n\n', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Request logged');
    }
    })
}).listen(8081);

console.log('local connection successful');
