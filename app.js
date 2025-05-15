
import express from "express";
import { engine } from "express-handlebars";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import mongoose from "mongoose";
import methodOverride from "method-override";

import router from "./routes/index.routes.js";
import cartsRouter from "./routes/carts.routes.js"; 
import { validateObjectId } from "./middlewares/validateObjectId.js"; 


const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/auraDB";

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  family: 4
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => {
  console.error("❌ Error conectando a MongoDB:", err.message);
  process.exit(1);
});

const app = express();


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve("views"));


app.use(express.static(path.resolve("public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); 


app.use("/", router);


app.use("/api/carts", validateObjectId, cartsRouter);


const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.on("message", payload => {
    console.log("Mensaje recibido:", payload);
    socket.broadcast.emit("message", payload);
  });

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
