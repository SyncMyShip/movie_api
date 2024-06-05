const { timeStamp } = require('console');
const http = require('http'),
    url = require('url'),
    fs = require('fs')

// create server that listens on http proxy port 8080
http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Thanks for connecting to my localhost!');
}).listen(8080);

console.log('local connection successful');

// parse incoming requests for the word "documentation"
// navigate to documentation.html if true, home page if false
let addr = request.url;
    q = new URL(addr, 'http://' + http.request.headers.host)

if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
} else {
    filePath = 'index.html';
}

// log both request URL and a timestamp to log.txt
fs.appendFile('log.txt', 'URL' + addr + '<br>' + 'Timestamp: ' + new Date() + '<br>', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Request logged');
    }
})

