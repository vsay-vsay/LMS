// const mongoose = require("mongoose");

// const courseSchema = new mongoose.Schema({
//     playlistName: { type: String, required: true },
//     description: { type: String, required: true },
//     classess: {type: String, required: true},
//     price: { type: String, required: true },
//     subject: {type: String, required: true},
//     time: {type: String, required: true},
//     lectures: { type: Number, required: true },
//     level: {type: String, enum: ["Beginner", "Intermidiate", "Advanced"], required: true},
//     visibility: { type: String, enum: ["public", "private"], required: true },
//     domain: { type: mongoose.Schema.Types.ObjectId, ref: "Domain", required: false }, // Only for private courses
//     tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who created the course
//     thumbnail: { type: String, required: true }, // Cloudinary image URL
// }, { timestamps: true });

// module.exports = mongoose.model("Course", courseSchema);

// const mongoose = require("mongoose");

// const courseSchema = new mongoose.Schema({
//   playlistName: { type: String, required: true },
//   description: { type: String, required: true },
//   classess: { type: String, required: true },
//   price: { type: String, required: true },
//   subject: { type: String, required: true },
//   time: { type: String, required: true },
//   lectures: { type: Number, required: true },
//   level: {
//     type: String,
//     enum: ["Beginner", "Intermidiate", "Advanced"],
//     required: true
//   },
//   visibility: {
//     type: String,
//     enum: ["public", "private"],
//     required: true
//   },
//   domain: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Domain"
//   },
//   tutor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   thumbnail: { type: String, required: true },
// }, { timestamps: true });

// module.exports = mongoose.model("Course", courseSchema);


const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  topicName: { type: String, required: true },
  description: { type: String },
  files: [{ type: String }] // Cloudinary URLs
}, { timestamps: true });

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  time: { type: String },
  topics: [topicSchema]
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  playlistName: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  visibility: { type: String, enum: ["public", "private"], default: "public" },
  domain: { type: String, default: null },
  classess: { type: String },
  subject: { type: String },
  time: { type: String },
  level: { type: String },
  lectures: { type: String },
  thumbnail: { type: String },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sections: [sectionSchema]
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
