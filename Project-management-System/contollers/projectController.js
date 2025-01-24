const Project = require("../models/project");
const Task = require("../models/task");
const dayjs = require("dayjs");

exports.createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, status } = req.body;

    // Validate date format
    if (
      !dayjs(startDate, "YYYY-MM-DD", true).isValid() ||
      !dayjs(endDate, "YYYY-MM-DD", true).isValid()
    ) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    const project = new Project({
      name,
      description,
      startDate,
      endDate,
      status,
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const { name, status, page = 1, limit = 10 } = req.query;

    // Build a filter object
    const filter = {};
    if (name) filter.name = { $regex: name, $options: "i" }; // Case-insensitive name search
    if (status) filter.status = status;

    // Pagination
    const skip = (page - 1) * limit;
    const projects = await Project.find(filter).skip(skip).limit(Number(limit));

    // Get total count for pagination metadata
    const total = await Project.countDocuments(filter);

    res.json({
      projects,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    // Delete associated tasks
    await Task.deleteMany({ projectId: project._id });
    res.json({ message: "Project and associated tasks deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
