import mongoose, { Schema, Document, Model } from "mongoose";

export type ProjectCategory = "Web" | "AI" | "IoT" | "Apps";

export interface IProject extends Document {
  title: string;
  description: string;
  image: string;
  imagePublicId?: string;
  category: ProjectCategory;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String },
    category: {
      type: String,
      enum: ["Web", "AI", "IoT", "Apps"],
      required: true,
    },
    tags: [{ type: String, trim: true }],
    liveUrl: { type: String },
    githubUrl: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
