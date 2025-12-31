import express, { Request, Response } from "express";
import { PORT } from "./config";
import { User, Workflow } from "@n8n/db";
import { startServer } from "./config/db";
import cors from "cors";
import { generateToken } from "./lib/jwt";
import cookieParser from "cookie-parser";
import { authenticate } from "./middleware/auth.middleware";
import { publishWorkflowJob } from "./queue/producer";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: "GET, POST, PUT, PATCH, DELETE",
  })
);

app.get("/", (req, res) => {
  res.send("hello boi whats up haha!");
});

app.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new Error("Invalid data");
  }

  try {
    await User.create({ username, password });
    res.status(201).json({
      data: null,
      success: true,
      message: "user registered successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      error,
      message: "user registration failed",
    });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new Error("Invalid data");
  }

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "invalid credentials",
      });
    }
    const token = generateToken({ id: user.id, username: user.username });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({
      data: { token },
      success: true,
      message: "user login successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      error,
      message: "user login failed",
    });
  }
});

// const nodesData = nodeSchema.safeParse(nodes);

// if (!nodesData.success) {
//   throw new Error("invalid nodes data");
// }

// const edgesData = edgeSchema.safeParse(edges);
// if (!edgesData.success) {
//   throw new Error("invalid edges data");
// }

app.get("/workflow", authenticate, async (req: any, res: Response) => {
  const user = req.user;

  try {
    const workflows = await Workflow.find({ userId: user.id });
    res.status(200).json({
      success: true,
      data: workflows,
      message: "Workflow fetched successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      error,
    });
  }
});

app.post("/workflow", authenticate, async (req: any, res: Response) => {
  const { nodes, edges } = req.body;
  const user = req.user;

  const trigger = nodes.find(
    (node: any) =>
      node.type == "schedule-trigger" && node.data.nodeType == "Trigger"
  );

  const executionTimeInMs = trigger.data.metadata.executionTimeInMs;

  try {
    const workflow = await Workflow.create({
      userId: user.id,
      edges,
      nodes,
    });
    if (workflow) {
      await publishWorkflowJob(
        workflow._id.toString(),
        user.id,
        executionTimeInMs
      );
    }
    res.status(201).json({
      success: true,
      data: null,
      message: "Workflow created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      error,
    });
  }
});

startServer();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
