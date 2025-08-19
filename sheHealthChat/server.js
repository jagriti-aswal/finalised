// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import path from "path";
// import http from "http";
// import { Server } from "socket.io";
// import { fileURLToPath } from "url";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" },
// });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Fix __dirname in ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // MongoDB connection
// mongoose
//   .connect("mongodb://127.0.0.1:27017/shehealth", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB error:", err));

// // Schemas
// const messageSchema = new mongoose.Schema({
//   text: String,
//   timestamp: { type: Date, default: Date.now },
//   upvotes: { type: Number, default: 0 },
//   voters: [String],
// });

// const questionSchema = new mongoose.Schema({
//   text: String,
//   timestamp: { type: Date, default: Date.now },
//   upvotes: { type: Number, default: 0 },
//   voters: [String],
// });

// const Message = mongoose.model("Message", messageSchema);
// const Question = mongoose.model("Question", questionSchema);

// // Static files
// app.use(express.static(path.join(__dirname)));

// // Routes
// app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
// app.get("/questions", (req, res) =>
//   res.sendFile(path.join(__dirname, "questions.html"))
// );

// // 🔥 Custom abusive words list (English + Hindi)
// const abusiveWords = [
//   // English
//   "fuck", "fucking", "bitch", "asshole", "bastard", "slut", "dick", "pussy",
//   "motherfucker", "shit",

//   // Hindi (Romanized + Devanagari)
//   "chutiya", "madarchod", "bhenchod", "gandu", "randi", "kamina", "harami",
//   "lund", "lavde", "bhosdike", "chutiye", "jhant", "gaand",
//   "चूतिया", "मादरचोद", "भेंचोद", "गांडू", "रंडी", "कमीना", "हरामी",
//   "लंड", "लवड़े", "भड़वा", "भड़वे"
// ];

// // Censor function
// function censorText(text) {
//   let clean = text;
//   abusiveWords.forEach(word => {
//     const regex = new RegExp(`\\b${word}\\b`, "gi");
//     clean = clean.replace(regex, "**");
//   });
//   return clean;
// }

// // Socket.io connection
// io.on("connection", async socket => {
//   console.log("✅ User connected:", socket.id);

//   // Load existing messages and questions
//   const messages = await Message.find().sort({ timestamp: 1 });
//   const questions = await Question.find().sort({ timestamp: 1 });
//   socket.emit("loadMessages", messages);
//   socket.emit("loadQuestions", questions);

//   // New message
//   socket.on("sendMessage", async text => {
//     const cleanText = censorText(text);
//     const message = new Message({ text: cleanText });
//     await message.save();
//     io.emit("newMessage", message);
//   });

//   // New question
//   socket.on("sendQuestion", async text => {
//     const cleanText = censorText(text);
//     const question = new Question({ text: cleanText });
//     await question.save();
//     io.emit("newQuestion", question);
//   });

//   // Upvote message
//   socket.on("upvoteMessage", async id => {
//     const message = await Message.findById(id);
//     if (message && !message.voters.includes(socket.id)) {
//       message.upvotes += 1;
//       message.voters.push(socket.id);
//       await message.save();
//       io.emit("updateMessage", message);
//     }
//   });

//   // Upvote question
//   socket.on("upvoteQuestion", async id => {
//     const question = await Question.findById(id);
//     if (question && !question.voters.includes(socket.id)) {
//       question.upvotes += 1;
//       question.voters.push(socket.id);
//       await question.save();
//       io.emit("updateQuestion", question);
//     }
//   });

//   socket.on("disconnect", () => console.log("❌ User disconnected:", socket.id));
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });



// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import path from "path";
// import http from "http";
// import { Server } from "socket.io";
// import { fileURLToPath } from "url";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" },
// });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Fix __dirname in ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // MongoDB connection
// mongoose
//   .connect("mongodb://127.0.0.1:27017/shehealth", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB error:", err));

// // Schemas
// const messageSchema = new mongoose.Schema({
//   text: String,
//   timestamp: { type: Date, default: Date.now },
//   upvotes: { type: Number, default: 0 },
//   voters: [String],
// });

// const questionSchema = new mongoose.Schema({
//   text: String,
//   timestamp: { type: Date, default: Date.now },
//   upvotes: { type: Number, default: 0 },
//   voters: [String],
// });

// const Message = mongoose.model("Message", messageSchema);
// const Question = mongoose.model("Question", questionSchema);

// // 🔹 Serve static files from 'public' folder
// app.use(express.static(path.join(__dirname, "public")));

// // Routes
// app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
// app.get("/questions", (req, res) => res.sendFile(path.join(__dirname, "public", "questions.html")));

// // 🔥 Custom abusive words (English + Hindi)
// const abusiveWords = [
//   // English
//   "fuck", "fucking", "bitch", "asshole", "bastard", "slut", "dick", "pussy",
//   "motherfucker", "shit",
//   // Hindi Romanized + Devanagari
//   "chutiya", "madarchod", "bhenchod", "gandu", "randi", "kamina", "harami",
//   "lund", "lavde", "bhosdike", "chutiye", "jhant", "gaand",
//   "चूतिया", "मादरचोद", "भेंचोद", "गांडू", "रंडी", "कमीना", "हरामी",
//   "लंड", "लवड़े", "भड़वा", "भड़वे"
// ];

// // Censor function
// function censorText(text) {
//   let clean = text;
//   abusiveWords.forEach(word => {
//     const regex = new RegExp(`\\b${word}\\b`, "gi");
//     clean = clean.replace(regex, "**");
//   });
//   return clean;
// }

// // Socket.io connection
// io.on("connection", async socket => {
//   console.log("✅ User connected:", socket.id);

//   // Load existing messages and questions
//   const messages = await Message.find().sort({ timestamp: 1 });
//   const questions = await Question.find().sort({ timestamp: 1 });
//   socket.emit("loadMessages", messages);
//   socket.emit("loadQuestions", questions);

//   // New message
//   socket.on("sendMessage", async text => {
//     const cleanText = censorText(text);
//     const message = new Message({ text: cleanText });
//     await message.save();
//     io.emit("newMessage", message);
//   });

//   // New question
//   socket.on("sendQuestion", async text => {
//     const cleanText = censorText(text);
//     const question = new Question({ text: cleanText });
//     await question.save();
//     io.emit("newQuestion", question);
//   });

//   // Upvote message
//   socket.on("upvoteMessage", async id => {
//     const message = await Message.findById(id);
//     if (message && !message.voters.includes(socket.id)) {
//       message.upvotes += 1;
//       message.voters.push(socket.id);
//       await message.save();
//       io.emit("updateMessage", message);
//     }
//   });

//   // Upvote question
//   socket.on("upvoteQuestion", async id => {
//     const question = await Question.findById(id);
//     if (question && !question.voters.includes(socket.id)) {
//       question.upvotes += 1;
//       question.voters.push(socket.id);
//       await question.save();
//       io.emit("updateQuestion", question);
//     }
//   });

//   socket.on("disconnect", () => console.log("❌ User disconnected:", socket.id));
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });



// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import path from "path";
// import http from "http";
// import { Server } from "socket.io";
// import { fileURLToPath } from "url";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" },
// });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Fix __dirname in ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // MongoDB connection
// mongoose
//   .connect("mongodb://127.0.0.1:27017/shehealth")
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB error:", err));

// // Schemas
// const messageSchema = new mongoose.Schema({
//   text: String,
//   timestamp: { type: Date, default: Date.now },
//   upvotes: { type: Number, default: 0 },
//   voters: [String],
// });

// const questionSchema = new mongoose.Schema({
//   text: String,
//   timestamp: { type: Date, default: Date.now },
//   upvotes: { type: Number, default: 0 },
//   voters: [String],
// });

// const Message = mongoose.model("Message", messageSchema);
// const Question = mongoose.model("Question", questionSchema);

// // Serve static files from 'public'
// app.use(express.static(path.join(__dirname, "public")));

// // Routes
// app.get("/", (req, res) =>
//   res.sendFile(path.join(__dirname, "public", "index.html"))
// );
// app.get("/questions", (req, res) =>
//   res.sendFile(path.join(__dirname, "public", "questions.html"))
// );

// // 🔥 Abusive words list (English + Hindi)
// const abusiveWords = [
//   // English
//   "fuck", "fucking", "bitch", "asshole", "bastard", "slut", "dick", "pussy",
//   "motherfucker", "shit",
//   // Hindi Romanized + Devanagari
//   "chutiya", "madarchod", "bhenchod", "gandu", "randi", "kamina", "harami",
//   "lund", "lavde", "bhosdike", "chutiye", "jhant", "gaand",
//   "चूतिया", "मादरचोद", "भेंचोद", "गांडू", "रंडी", "कमीना", "हरामी",
//   "लंड", "लवड़े", "भड़वा", "भड़वे"
// ];

// // Censor function (ensures input is string)
// function censorText(text) {
//   if (typeof text !== "string") return "";
//   let clean = text;
//   abusiveWords.forEach((word) => {
//     const regex = new RegExp(`\\b${word}\\b`, "gi");
//     clean = clean.replace(regex, "**");
//   });
//   return clean;
// }

// // Socket.io connection
// io.on("connection", async (socket) => {
//   console.log("✅ User connected:", socket.id);

//   // Load existing messages & questions
//   const messages = await Message.find().sort({ timestamp: 1 });
//   const questions = await Question.find().sort({ timestamp: 1 });
//   socket.emit("loadMessages", messages);
//   socket.emit("loadQuestions", questions);

//   // New message
//   socket.on("sendMessage", async (text) => {
//     const cleanText = censorText(text);
//     const message = new Message({ text: cleanText });
//     await message.save();
//     io.emit("newMessage", message);
//   });

//   // New question
//   socket.on("sendQuestion", async (text) => {
//     const cleanText = censorText(text);
//     const question = new Question({ text: cleanText });
//     await question.save();
//     io.emit("newQuestion", question);
//   });

//   // Upvote message
//   socket.on("upvoteMessage", async (id) => {
//     const message = await Message.findById(id);
//     if (message && !message.voters.includes(socket.id)) {
//       message.upvotes += 1;
//       message.voters.push(socket.id);
//       await message.save();
//       io.emit("updateMessage", message);
//     }
//   });

//   // Upvote question
//   socket.on("upvoteQuestion", async (id) => {
//     const question = await Question.findById(id);
//     if (question && !question.voters.includes(socket.id)) {
//       question.upvotes += 1;
//       question.voters.push(socket.id);
//       await question.save();
//       io.emit("updateQuestion", question);
//     }
//   });

//   socket.on("disconnect", () => console.log("❌ User disconnected:", socket.id));
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () =>
//   console.log(`🚀 Server running on http://localhost:${PORT}`)
// );



import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";

// Import your models
import Message from "./models/Message.js";
import Question from "./models/Question.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/shehealth")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// --- API route to load messages for a room ---
app.get("/api/messages/:room", async (req, res) => {
  const room = req.params.room;
  const messages = await Message.find({ room }).sort({ timestamp: 1 });
  res.json({ messages });
});

// --- Socket.io ---
io.on("connection", socket => {
  console.log("✅ User connected:", socket.id);

  socket.on("joinRoom", room => {
    socket.join(room);
    console.log(`User ${socket.id} joined ${room}`);
  });

  // Send message
  socket.on("sendMessage", async msg => {
    const cleanMsg = censorText(msg.message);
    const message = new Message({
      username: msg.username,
      message: cleanMsg,
      room: msg.room,
      type: msg.type || "message"
    });
    await message.save();
    io.to(msg.room).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => console.log("❌ User disconnected:", socket.id));
});

// --- Abusive words filter ---
const abusiveWords = ["fuck", "shit", "bitch", "asshole", "madarchod", "bhosdike", "chutiya"];
function censorText(text) {
  if (!text) return text;
  let clean = text;
  abusiveWords.forEach(word => {
    const regex = new RegExp(word, "gi");
    clean = clean.replace(regex, "**");
  });
  return clean;
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
