import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 5000;

app.listen(port, () => {
  console.log(`Auth service running on port ${port}`);
});
