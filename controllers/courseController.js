const Course = require("../models/Course");

// ✅ Create a Course
const createCourse = async (req, res) => {
    try {
        const { playlistName, description, price, visibility, classess, subject, time, level, lectures } = req.body;
        const tutorId = req.user.id;
        const tutorDomain = req.user.domain; // Extract domain from user

        if (!req.file) {
            return res.status(400).json({ message: "Course thumbnail is required" });
        }

        if (!["public", "private"].includes(visibility)) {
            return res.status(400).json({ message: "Invalid visibility option" });
        }

        if (visibility === "private" && !tutorDomain) {
            return res.status(400).json({ message: "Private courses must have a domain" });
        }

        const course = new Course({
            playlistName,
            description,
            price,
            classess,
            time, 
            level, 
            lectures,
            subject,
            visibility,
            domain: visibility === "private" ? tutorDomain : null, // Assign domain only if private
            tutor: tutorId,
            thumbnail: req.file.path, // Cloudinary image URL
        });

        await course.save();
        return res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};



// ✅ Get Public Courses (Accessible to everyone)
const getPublicCourses = async (req, res) => {
    try {
        const courses = await Course.find({ visibility: "public" })
            .populate("tutor", "name email");

        if (courses.length === 0) {
            return res.status(200).json({ message: "No public courses found", courses: [] });
        }

        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching public courses:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// ✅ Get Private Courses (Accessible within the domain)
const getPrivateCourses = async (req, res) => {
    try {
        const userDomain = req.user.domain; // Extract domain from logged-in user

        if (!userDomain) {
            return res.status(403).json({ message: "You do not belong to a domain" });
        }

        const courses = await Course.find({ domain: userDomain, visibility: "private" }) // Fetch only private courses for the same domain
            .populate("tutor", "name email");

        if (courses.length === 0) {
            return res.status(200).json({ message: "No private courses found in this domain", courses: [] });
        }

        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 2️⃣ GET ALL COURSES CREATED BY LOGGED-IN USER
const getCoursesByTutor = async (req, res) => {
    try {
        const tutorId = req.user.id;
        const courses = await Course.find({ tutor: tutorId });

        if (!courses.length) {
            return res.status(404).json({ message: "No courses found" });
        }

        res.status(200).json({ courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 3️⃣ UPDATE COURSE (Only by Course Creator)
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params; // Course ID
        const tutorId = req.user.id; // Logged-in Tutor ID
        const { playlistName, description, price, visibility, classess, subject, time, level, lectures } = req.body;

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.tutor.toString() !== tutorId) {
            return res.status(403).json({ message: "Unauthorized to update this course" });
        }

        // Update fields
        course.playlistName = playlistName || course.playlistName;
        course.description = description || course.description;
        course.price = price || course.price;
        course.visibility = visibility || course.visibility;
        course.classess = classess || course.classess;
        course.subject = subject || course.subject;
        course.time = time || course.time;
        course.level = level || course.level;
        course.lectures = lectures || course.lectures;
        course.thumbnail = req.file ? req.file.path : course.thumbnail;

        await course.save();
        return res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 4️⃣ DELETE COURSE (Only by Course Creator)
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params; // Course ID
        const tutorId = req.user.id; // Logged-in Tutor ID

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.tutor.toString() !== tutorId) {
            return res.status(403).json({ message: "Unauthorized to delete this course" });
        }

        await Course.findByIdAndDelete(id);
        return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const addSection = async (req, res) => {
    try {
      const { courseId } = req.params;
      const { title, description, time } = req.body;
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      if (!course.sections) {
        course.sections = [];
      }
  
      course.sections.push({ title, description, time, topics: [] });
      await course.save();
  
      res.status(200).json({ message: "Section added", course });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

  const deleteSection = async (req, res) => {
    try {
      const { courseId, sectionId } = req.params;
  
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });
  
      // Find the index of the section to be deleted
      const sectionIndex = course.sections.findIndex(
        (section) => section._id.toString() === sectionId
      );
  
      if (sectionIndex === -1) {
        return res.status(404).json({ message: "Section not found" });
      }
  
      // Remove the section from the array
      course.sections.splice(sectionIndex, 1);
      await course.save();
  
      res.status(200).json({ message: "Section deleted successfully" });
    } catch (err) {
      console.error("Delete Section Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

  const addTopic = async (req, res) => {
    try {
      const { courseId, sectionId } = req.params;
      const { topicName, description } = req.body;
  
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });
  
      const section = course.sections.id(sectionId);
      if (!section) return res.status(404).json({ message: "Section not found" });
  
      const fileUrls = req.files.map(file => file.path); // Cloudinary URLs
  
      section.topics.push({ topicName, description, files: fileUrls });
      await course.save();
  
      res.status(200).json({ message: "Topic added", course });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  const deleteTopic = async (req, res) => {
    try {
      const { courseId, sectionId, topicId } = req.params;
  
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });
  
      const section = course.sections.id(sectionId);
      section.topics.id(topicId).remove();
  
      await course.save();
  
      res.status(200).json({ message: "Topic deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  const updateTopic = async (req, res) => {
    try {
      const { courseId, sectionId, topicId } = req.params;
      const { topicName, description } = req.body;
  
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });
  
      const section = course.sections.id(sectionId);
      const topic = section.topics.id(topicId);
  
      topic.topicName = topicName || topic.topicName;
      topic.description = description || topic.description;
      await course.save();
  
      res.status(200).json({ message: "Topic updated", topic });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

const getSectionsWithoutTopics = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).populate("tutor", "name email");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Map sections without topics
    const sectionsWithoutTopics = course.sections.map(section => ({
      _id: section._id,
      title: section.title,
      description: section.description,
      time: section.time,
      createdAt: section.createdAt,
      updatedAt: section.updatedAt
    }));

    res.status(200).json({
      _id: course._id,
      playlistName: course.playlistName,
      description: course.description,
      price: course.price,
      visibility: course.visibility,
      domain: course.domain,
      classess: course.classess,
      subject: course.subject,
      time: course.time,
      level: course.level,
      lectures: course.lectures,
      thumbnail: course.thumbnail,
      tutor: course.tutor,
      sections: sectionsWithoutTopics,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSections = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).populate("tutor", "name email");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      _id: course._id,
      playlistName: course.playlistName,
      description: course.description,
      price: course.price,
      visibility: course.visibility,
      domain: course.domain,
      classess: course.classess,
      subject: course.subject,
      time: course.time,
      level: course.level,
      lectures: course.lectures,
      thumbnail: course.thumbnail,
      tutor: course.tutor,
      sections: course.sections.map(section => ({
        _id: section._id,
        title: section.title,
        description: section.description,
        time: section.time,
        topics: section.topics.map(topic => ({
          _id: topic._id,
          topicName: topic.topicName,
          description: topic.description,
          files: topic.files
        })),
        createdAt: section.createdAt,
        updatedAt: section.updatedAt
      })),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { getSections,getSectionsWithoutTopics, updateTopic, deleteTopic, addTopic, deleteSection, addSection, createCourse, getPublicCourses, getPrivateCourses, getCoursesByTutor,updateCourse,deleteCourse };
