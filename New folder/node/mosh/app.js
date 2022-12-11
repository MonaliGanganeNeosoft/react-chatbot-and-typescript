const http = require("http");
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("hello moni ");
    res.write("nice to see you");
    res.end();
  }
  if (req.url === "/api/courses") {
    res.write(JSON.stringify([1, 2, 3, "Moni"]));
    res.end();
  }
});

server.listen(3000);
console.log("listenng on 3000 port");
