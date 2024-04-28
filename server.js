//server.js
import mongoose from "mongoose";
import app from "./app.js";

const { DB_HOST, PORT = 3000 } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server started successfully on port 3000");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
