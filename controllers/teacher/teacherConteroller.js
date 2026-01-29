const teacherController = async (req, res) => {
    try{
        console.log("Welcome to teacher controller")
        res.status(200);
        return res.json({ message: "Welcome to teacher controller" })
    }catch(err){
        console.log("Error in teacher controller", err)
        res.status(500);
        return res.json({ message: err.message })
    }
}

module.exports = {teacherController}