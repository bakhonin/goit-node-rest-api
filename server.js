import mongoose from "mongoose";
import app from "./app.js";

const { DB_HOST } = process.env;
const PORT = process.env.PORT || 8080;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started successfully on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
