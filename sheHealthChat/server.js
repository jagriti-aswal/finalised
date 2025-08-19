import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import Filter from "bad-words"; // ✅ fixed bad-words import

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/shehealth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Schema for Chat Messages
const messageSchema = new mongoose.Schema({
  text: String,
  timestamp: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 },
  voters: [String], // Store socket IDs that voted
});

const Message = mongoose.model("Message", messageSchema);

// Schema for Questions
const questionSchema = new mongoose.Schema({
  text: String,
  timestamp: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 },
  voters: [String],
});

const Question = mongoose.model("Question", questionSchema);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/questions", (req, res) => {
  res.sendFile(path.join(__dirname, "questions.html"));
});

// Socket.io connection
io.on("connection", async (socket) => {
  console.log("✅ A user connected:", socket.id);

  // Load existing messages
  const messages = await Message.find().sort({ timestamp: 1 });
  socket.emit("loadMessages", messages);

  // Load existing questions
  const questions = await Question.find().sort({ timestamp: 1 });
  socket.emit("loadQuestions", questions);

  // Handle new messages
  socket.on("sendMessage", async (text) => {
    const filter = new Filter();
    const cleanText = filter.clean(text);

    const message = new Message({ text: cleanText });
    await message.save();

    io.emit("newMessage", message);
  });

  // Handle new questions
  socket.on("sendQuestion", async (text) => {
    const filter = new Filter();
    const cleanText = filter.clean(text);

    const question = new Question({ text: cleanText });
    await question.save();

    io.emit("newQuestion", question);
  });

  // Handle upvotes for messages
  socket.on("upvoteMessage", async (id) => {
    const message = await Message.findById(id);
    if (message && !message.voters.includes(socket.id)) {
      message.upvotes += 1;
      message.voters.push(socket.id);
      await message.save();
      io.emit("updateMessage", message);
    }
  });

  // Handle upvotes for questions
  socket.on("upvoteQuestion", async (id) => {
    const question = await Question.findById(id);
    if (question && !question.voters.includes(socket.id)) {
      question.upvotes += 1;
      question.voters.push(socket.id);
      await question.save();
      io.emit("updateQuestion", question);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
