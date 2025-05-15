// app.js

import express from "express";
import { engine } from "express-handlebars";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import mongoose from "mongoose";
import methodOverride from "method-override";

import router from "./routes/index.routes.js";
import cartsRouter from "./routes/carts.routes.js"; // Router de carritos
import { validateObjectId } from "./middlewares/validateObjectId.js"; // Middleware de validación

// --- Conexión a MongoDB ---
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

// --- Inicialización de Express ---
const app = express();

// --- Configuración de Handlebars ---
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve("views"));

// --- Middlewares ---
app.use(express.static(path.resolve("public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // <<< Necesario para formularios DELETE/PUT

// --- Rutas de la aplicación ---
app.use("/", router);

// Montar middleware de validación y router de carritos con API
app.use("/api/carts", validateObjectId, cartsRouter);

// --- Creación de servidor HTTP y Socket.IO ---
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// --- Eventos WebSocket ---
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

// --- Arranque del servidor ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
