const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
connectDB();

app.use(express.json());

// When user comes to this route then we are redirecting the user to projects route so that he can create project update project ,delete project and get all projects (CRUD Operations)
app.use("/projects", projectRoutes);
// When user comes to this route then we are redirecting the user to tasks route so that he can create task update task ,delete task and get all tasks (CRUD Operations)
app.use("/tasks", taskRoutes);
// When user comes to this route then we are redirecting the users to projects route so that he can create user update user ,delete user and get all users (CRUD Operations)
app.use("/users", userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
