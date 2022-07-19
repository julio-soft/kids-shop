var app = require("./server");
const db = require("./src/models");
const initial = require("./src/models/init");

console.log("Synchronizing Model.");
db.sequelize.sync({ force: true }).then(async () => {
  console.log("All models were synchronized successfully.");
  console.log("Setting initial data.");
  await initial();
  console.log("All initial data were inserted successfully.");

  const PORT = process.env.PORT || 3000;

  const server = app.listen(PORT, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log("App listening at http://%s:%s", host, port);
  });
});
