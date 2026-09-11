import dotenv from "dotenv";
import http from "http";
import connectDB from "./config/db.js";
import app from "./app.js";
import { initSocket } from "./socket/socket.js";


dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
