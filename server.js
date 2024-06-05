const http = require('http'),
    url = require('url'),
    fs = require('fs')

// create server that listens on port 8081
http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Thanks for connecting to my localhost!');

    // parse incoming requests for the word "documentation"
    // navigate to documentation.html if true, home page if false
    let addr = request.url;
    q = new URL(addr, 'http://' + request.headers.host)

    if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
    } else {
    filePath = 'index.html';
    }

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
