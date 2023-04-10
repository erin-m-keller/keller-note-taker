// initialize variables
const express = require('express'),
      path = require('path'),
      app = express(),
      port = process.env.PORT || 3000,
      api = require("./api"),
      routes = require("./routes");

// serve client side files to html pages (images, js, css, etc.)
app.use(express.static(path.join(__dirname, '/public')));

// api and html routes
app.use("/api",api);
app.use("/",routes);

// bind/listen to the connections on the specified port
app.listen(port);

// log a message to the terminal with the connected server location
console.log('Server started at http://localhost:' + port);