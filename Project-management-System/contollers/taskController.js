const Task = require("../models/task");
const Project = require("../models/project");
const User = require("../models/user");

exports.createTask = async (req, res) => {
  try {
    const { projectId, assignedTo } = req.body;

    // We must apply validations that ,project is available

    const isProjectAvailable = await Project.find({ _id: projectId });
    console.log(":: isProjectAvailable", isProjectAvailable);
    if (!isProjectAvailable || !isProjectAvailable.length) {
      return res.status(404).json({
        message: "Project not found.Please provide available/correct project",
      });
    }

    // Applying validations such that user should not be able to task without assing user
    const isUserAvailable = await User.find({ _id: assignedTo });
    console.log(":: isUserAvailable)", !isUserAvailable);

    if (!isUserAvailable || !isUserAvailable?.length) {
      return res.status(404).json({
        message: "User not found,Please provide available/correct user",
      });
    }

    // In creating task we have to apply conditions. => if user have task && if count of not completed task is euqal or greater than 5 then we don't allow user to create task
    const activeTasks = await Task.countDocuments({
      assignedTo,
      status: { $ne: "Completed" },
    });
    if (activeTasks >= 5) {
      return res
        .status(400)
        .json({ message: "User has too many active tasks" });
    }

    const task = new Task(req.body);
    await task.save();

    // Check if all tasks in the project are completed => if all task are completed
    // then we make project completed
    const projectTasks = await Task.find({ projectId });
    const allCompleted = projectTasks.every(
      (task) => task.status === "Completed"
    );
    if (allCompleted) {
      await Project.findByIdAndUpdate(projectId, { status: "Completed" });
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId, userId, name, status, page = 1, limit = 10 } = req.query;

    // Build a filter object
    const filter = {};
    if (projectId) filter.projectId = projectId;
    if (userId) filter.assignedTo = userId;
    if (name) filter.name = { $regex: name, $options: "i" }; // Case-insensitive name search
    if (status) filter.status = status;

    // Pagination
    const skip = (page - 1) * limit;
    const tasks = await Task.find(filter).skip(skip).limit(Number(limit));

    // Get total count for pagination metadata
    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check if the project's tasks are all completed
    const projectTasks = await Task.find({ projectId: task.projectId });
    const allCompleted = projectTasks.every(
      (task) => task.status === "Completed"
    );
    if (allCompleted) {
      await Project.findByIdAndUpdate(task.projectId, { status: "Completed" });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
