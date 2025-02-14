import { Schema } from "mongoose";

const ModelInput = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  municipality: {
    type: String,
    required: true,
    trim: true,
  },
  province: {
    type: String,
    required: true,
    trim: true,
  },
  contactInfo: {
    phone: String,
    email: String,
    emergencyContact: String,
  },
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default ModelInput;
