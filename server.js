var http = require('http'),
  url = require('url'),
  path = require('path'),
  fs = require('fs');
const PORT = process.env.PORT || 8080;

http
  .createServer(function (request, response) {
    var uri = url.parse(request.url).pathname,
      filename = path.join(process.cwd(), uri);

    var contentTypesByExtension = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.woff': 'font/woff',
      '.ttf': 'font/ttf',
    };

    fs.exists(filename, function (exists) {
      if (!exists) {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.write('404 Not Found\n');
        response.end();
        return;
      }

      if (fs.statSync(filename).isDirectory()) filename += '/index.html';

      fs.readFile(filename, 'binary', function (err, file) {
        if (err) {
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.write(err + '\n');
          response.end();
          return;
        }

        var headers = {};
        var contentType = contentTypesByExtension[path.extname(filename)];
        if (contentType) headers['Content-Type'] = contentType;
        headers['X-Frame-Options'] = 'sameorigin';

        response.writeHead(200, headers);
        response.write(file, 'binary');
        response.end();
      });
    });
  })
  .listen(parseInt(PORT, 10));

console.log(`Static file server running at\n  => ${process.env.SERVR_HOST}:${process.env.PORT} \nCTRL + C to shutdown`);
