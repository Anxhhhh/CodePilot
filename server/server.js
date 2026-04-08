import app from "./src/index.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const startServer = () => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();












