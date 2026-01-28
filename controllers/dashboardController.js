const dashboardController = async (req, res) => {
    try{
        console.log("Welcome to dashboard controller")
        res.status(200);
        return res.json({ message: "Welcome to dashboard controller" })
    }catch(err){
        console.log("Error in dashboard controller", err)
        res.status(500);
        return res.json({ message: err.message })
    }
}

module.exports = {dashboardController}
