import { createApp } from "./app.js";
import { config } from "./config.js";

const server = createApp().listen(config.PORT, () => {
  console.info(`API listening on :${config.PORT}`);
});
server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${config.PORT} is already in use. Set a different PORT in .env or stop the process using it.`);
    process.exitCode = 1;
    return;
  }
  throw error;
});
