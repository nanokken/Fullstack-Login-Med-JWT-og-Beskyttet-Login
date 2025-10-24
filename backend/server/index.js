require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const PORT = process.env.PORT || 3042;
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

const users = [
  {
    id: 1,
    name: "Asger",
    email: "Asger@example.com",
    password: bcrypt.hashSync("P@ssw0rd", 10),
  },
  {
    id: 2,
    name: "Sarangan",
    email: "Sarangan@example.com",
    password: bcrypt.hashSync("1234", 10),
  },
];

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: `Hello, ${req.user.name}. This is protected data.` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
