const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");

const connectDB = require("./config/db"); 

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const setupSocket = require("./socket/socket");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

connectDB(); 

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/upload", express.static("upload"))
app.get("/", (req, res) => {
  res.send("ChatWave API running...");
});

const server = http.createServer(app);

setupSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});