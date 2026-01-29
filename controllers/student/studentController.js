const studentController = async (req, res) => {
    try{
        console.log("Welcome to student controller")
        res.status(200);
        return res.json({ message: "Welcome to student controller" })
    }catch(err){
        console.log("Error in student controller", err)
        res.status(500);
        return res.json({ message: err.message })
    }
}

module.exports = {studentController}