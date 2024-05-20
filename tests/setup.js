const mongoose = require("mongoose");
const server = require("../server");

after(() => {
  return server.close(() => {
    return mongoose.connection.close();
  });
});
