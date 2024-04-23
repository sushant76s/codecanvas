exports.healthCheck = async (req, res) => {
    try {
        res.status(200).json({ status: true, message: "server is running!" });
    } catch (error) {
        console.error("Something went wrong!");
        res.status(500).json({ status: false, message: "oops server is not running :(" });
    }
};