const express = require('express'),
      path = require('path'),
      app = express(),
      port = process.env.PORT || 3000,
      api = require("./api"),
      routes = require("./routes");

// api and routes
app.use("/api",api);
app.use("/",routes);

// middleware to parse request body
app.use(express.json());

// serve client side files to html pages
app.use(express.static(path.join(__dirname, '/public')));

app.listen(port);
console.log('Server started at http://localhost:' + port);