var app = require('./server');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log("App listening at http://%s:%s", host, port);
  })    