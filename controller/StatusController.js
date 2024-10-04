exports.status = async (req, res) => {
    res.status(200).json({
        message: 'The server is running perfectly'
    })
}