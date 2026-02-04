const Class = require("../../models/classModel");
const Subject = require("../../models/subjectModel");
const TeacherAssign = require("../../models/teacherModel");
const User = require("../../models/userModel");

const adminController = async (req, res) => {
    try {
        console.log("Welcome to admin controller")
        res.status(200);
        return res.json({ message: "Welcome to admin controller" })
    } catch (err) {
        console.log("Error in admin controller", err)
        res.status(500);
        return res.json({ message: err.message })
    }
}

// Add Class
const addClass = async (req, res) => {
    const data = await Class.create(req.body);
    res.json(data);
};

// Add Subject
const addSubject = async (req, res) => {
    const data = await Subject.create(req.body);
    res.json(data);
};

// Assign Teacher
const assignTeacher = async (req, res) => {
  try {
    const { classId, teacherId, subjectId } = req.body;

    const classData = await Class.findById(classId);
    if (!classData) return res.status(404).json({ message: "Class not found" });

    // single assignment
    classData.subjectsId = subjectId;
    classData.teacherId = teacherId;
    await classData.save();

    const teacher = await User.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    teacher.classes = classId;
    teacher.subjects = subjectId;
    await teacher.save();

    res.json({ message: "Teacher assigned successfully", data:[teacher,classData] });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign Student
const assignStudent = async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    if (!studentId || !classId) {
      return res.status(400).json({ message: "studentId and classId required" });
    }

    const classData = await Class.findById(classId);
    if (!classData) return res.status(404).json({ message: "Class not found" });

    // single student assignment
    classData.studentsId = studentId;
    await classData.save();

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.classes = classId;
    await student.save();

    res.json({message: "Student assigned successfully",data:[student,classData]});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { adminController, addClass, addSubject, assignTeacher, assignStudent };

