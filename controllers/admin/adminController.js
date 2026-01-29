
const adminController = async (req, res) => {
    try{
        console.log("Welcome to admin controller")
        res.status(200);
        return res.json({ message: "Welcome to admin controller" })
    }catch(err){
        console.log("Error in admin controller", err)
        res.status(500);
        return res.json({ message: err.message })
    }
}

module.exports = { adminController }