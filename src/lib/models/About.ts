import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAbout extends Document {
  mission: string;
  vision: string;
  description: string;
  tagline: string;
  stats: {
    projects: number;
    clients: number;
    years: number;
    team: number;
  };
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    mission: {
      type: String,
      required: true,
      default:
        "To empower businesses with cutting-edge technology solutions that drive growth, efficiency, and innovation — making the digital future accessible to all.",
    },
    vision: {
      type: String,
      required: true,
      default:
        "To be the most trusted technology partner globally, transforming ideas into intelligent, scalable solutions that shape the next generation of digital experiences.",
    },
    description: {
      type: String,
      required: true,
      default:
        "Atrios Labs is a forward-thinking technology company specializing in web development, IoT solutions, AI automation, and application development. We combine deep technical expertise with creative design to build products that matter.",
    },
    tagline: {
      type: String,
      default: "Think Beyond Technology",
    },
    stats: {
      projects: { type: Number, default: 50 },
      clients: { type: Number, default: 30 },
      years: { type: Number, default: 5 },
      team: { type: Number, default: 20 },
    },
  },
  { timestamps: true }
);

const About: Model<IAbout> =
  mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);

export default About;
