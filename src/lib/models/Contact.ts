import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  email: string;
  phone: string;
  address: string;
  linkedIn?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  mapEmbedUrl?: string;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    email: { type: String, required: true, default: "hello@atrioslabs.com" },
    phone: { type: String, default: "+91 98765 43210" },
    address: { type: String, default: "Hyderabad, Telangana, India" },
    linkedIn: { type: String },
    twitter: { type: String },
    github: { type: String },
    instagram: { type: String },
    mapEmbedUrl: { type: String },
  },
  { timestamps: true }
);

const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
