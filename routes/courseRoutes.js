const express = require("express");
const { getSections,getSectionsWithoutTopics, updateTopic, deleteTopic, addTopic, deleteSection, addSection, createCourse, getPublicCourses, getPrivateCourses, getCoursesByTutor,updateCourse,deleteCourse } = require("../controllers/courseController");
const upload = require("../middleware/uploadMiddleware");
const { protect, tutorOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// 🟢 Create a Course (Only Tutors)
router.post("/create", protect, upload.single("thumbnail"), createCourse);

// 🟢 Get Public Courses
router.get("/public", getPublicCourses);

// 🟢 Get Private Courses (Only Within Domain)
router.get("/private", protect, getPrivateCourses);

// Crud Operation in Course
router.get("/", protect, getCoursesByTutor);
router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);

// 🟢 Section Apis
router.post("/:courseId/section",protect, addSection);
router.post("/:courseId/section/:sectionId/topic", upload.array("files"), protect, addTopic);
router.put("/:courseId/section/:sectionId/topic/:topicId", protect,updateTopic);
router.delete("/:courseId/section/:sectionId",protect, deleteSection);
router.delete("/:courseId/section/:sectionId/topic/:topicId",protect, deleteTopic);
router.get("/:id", protect, getSectionsWithoutTopics);
router.get("/section/:id", protect, getSections);



module.exports = router;