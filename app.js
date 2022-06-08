const cluster = require("cluster");

if (cluster.isMaster) {
  const numberOfWorkers = require("os").cpus().length;

  console.log("Master cluster setting up " + numberOfWorkers + " workers...");

  for (let i = 0; i < numberOfWorkers; i++) {
    cluster.fork();
  }

  cluster.on("online", (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code} and signal ${signal}`
    );
    console.log("Starting a new worker...");
    cluster.fork();
  });
} else {
  const express = require("express");
  const path = require("path");
  const cookieParser = require("cookie-parser");
  const logger = require("morgan");
  const dotenv = require("dotenv");
  const cors = require("cors");
  const corsConfig = require("./config/cors");

  const authRouter = require("./routes/auth");
  const testRouter = require("./routes/test");
  const usersRouter = require("./routes/users");

  dotenv.config();
  const app = express();

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));
  app.use(cors(corsConfig));

  app.options("*", cors());
  app.use("/auth", authRouter);
  app.use("/test", testRouter);
  app.use("/users", usersRouter);

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port: ${process.env.PORT || 3000}`);
  });

  module.exports = app;
}
