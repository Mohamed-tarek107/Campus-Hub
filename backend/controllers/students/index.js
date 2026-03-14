const { AssignDoctors } = require("./assignDoctors.controller");
const { getStudentCourses, getCourseDoctors } = require("./catalog.controller");
const { viewAllstudent_courses, viewAllstudent_doctors, viewAllstudent_tasks } = require("./views.controller");
const { takeFeedback } = require("./feedback.controller");

module.exports = {
    AssignDoctors,
    getStudentCourses,
    getCourseDoctors,
    viewAllstudent_courses,
    viewAllstudent_doctors,
    viewAllstudent_tasks,
    takeFeedback,
};
