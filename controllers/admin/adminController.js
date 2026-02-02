// const User = require("../../models/userModel");

// const adminController = async (req, res) => {
//     try{
//         console.log("Welcome to admin controller")
//         res.status(200);
//         return res.json({ message: "Welcome to admin controller" })
//     }catch(err){
//         console.log("Error in admin controller", err)
//         res.status(500);
//         return res.json({ message: err.message })
//     }
// }

// // view all teacher and student
// const viewAll = async (req, res) => {
//     try{
//         const teachers = await User.find({role: "teacher"});
//         const students = await User.find({role: "student"});
//         res.status(200);
//         return res.json({ message: "Welcome to admin view controller", teachers, students })
//     }catch(err){
//         console.log("Error in admin view controller", err)
//         res.status(500);
//         return res.json({ message: err.message })
//     }
// }

// // delete teacher
// const deleteTeacher = async (req, res) => {
//     try{
//         const {id} = req.params;
//         const deletedTeacher = await User.findByIdAndDelete(id);
//         res.status(200);
//         return res.json({ message: "Teacher deleted successfully", deletedTeacher });
//     }catch(err){
//         console.log("Error in admin delete teacher controller", err)
//         res.status(500);
//         return res.json({ message: err.message })
//     }
// }

// // delete student
// const deleteStudent = async (req, res) => {
//     try{
//         const {id} = req.params;
//         const deletedStudent = await User.findByIdAndDelete(id);
//         res.status(200);
//         return res.json({ message: "Student deleted successfully", deletedStudent });
//     }catch(err){
//         console.log("Error in admin delete student controller", err)
//         res.status(500);
//         return res.json({ message: err.message })
//     }
// }

// // update teacher
// const updateTeacher = async (req, res) => {
//     try{
//         const {id} = req.params;
//         const {name, email, password} = req.body;
//         const updatedTeacher = await User.findByIdAndUpdate(id, {name, email, password}, {new: true});
//         res.status(200);
//         return res.json({ message: "Teacher updated successfully", updatedTeacher });
//     }catch(err){
//         console.log("Error in admin update teacher controller", err)
//         res.status(500);
//         return res.json({ message: err.message })
//     }
// }

// // update student
// const updateStudent = async (req, res) => {
//     try{
//         const {id} = req.params;
//         const {name, email, password} = req.body;
//         const updatedStudent = await User.findByIdAndUpdate(id, {name, email, password}, {new: true});
//         res.status(200);
//         return res.json({ message: "Student updated successfully", updatedStudent });
//     }catch(err){
//         console.log("Error in admin update student controller", err)
//         res.status(500);
//         return res.json({ message: err.message })
//     }
// }

// module.exports = { adminController , viewAll , deleteTeacher , deleteStudent , updateTeacher , updateStudent}

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
  const { teacherId, classId, subjectId } = req.body;

  // 1 TeacherAssign collection me entry
  const assign = await TeacherAssign.create({
    teacherId,
    classId,
    subjectId
  });

  // 2 User (teacher) model update (optional but recommended)
  await User.findByIdAndUpdate(teacherId, {
    $addToSet: {
      subjects: subjectId,
      classes: classId
    }
  });

  res.json({
    message: "Teacher assigned to class & subject successfully",
    assign
  });
};
// const assignTeacher = async (req, res) => {
//     const { teacherId, classId, subjectId } = req.body;

//     const assign = await TeacherAssign.create({
//         teacherId,
//         classId,
//         subjectId
//     });

//     res.json({ message: "Teacher assigned successfully", assign });
// };

module.exports = { adminController, addClass, addSubject, assignTeacher };

