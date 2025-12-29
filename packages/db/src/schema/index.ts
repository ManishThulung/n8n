import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const EdgeSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    animated: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
);

const PositionSchema = new Schema(
  {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const NodeDataSchema = new Schema(
  {
    label: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: true,
    },
    nodeType: {
      type: String,
      enum: ["Action", "Trigger"],
      required: true,
    },
  },
  { _id: false }
);

const NodeSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    position: PositionSchema,
    data: NodeDataSchema,
  },
  { _id: false }
);

const WorkflowSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
  },
  edges: [EdgeSchema],
  nodes: [NodeSchema],
});

// const ExecutionSchema = new Schema({
//   status:{
//     type: ["Complete", "Ongoing"],
//     required: true
//   }

// })

export const User = mongoose.model("User", UserSchema);
export const Workflow = mongoose.model("Workflow", WorkflowSchema);
