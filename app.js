var app = require('./server');
const db = require("./src/models");
const initial = require('./src/models/init')


db.sequelize.sync({ force: true }).then(() => {
  console.log("All models were synchronized successfully.");
  initial();
  console.log("All initial data were inserted successfully.")
});;

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log("App listening at http://%s:%s", host, port);
  })    