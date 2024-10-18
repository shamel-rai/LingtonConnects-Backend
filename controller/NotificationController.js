const Notification = require('../model/NotificationModel');

exports.createNotification = async (req, res, io) => {
    const userId = req.userId;
    console.log('User', userId);
    const { message, type } = req.body;


    if (!userId) return res.status(400).json({ sucess: false, message: 'UserId is required' })

    try {
        const notification = new Notification({ userId, message, type });
        await notification.save();

        io.to(userId.toString()).emit('new_notification', notification); // emits the notification to the specific user in real-time
        return res.status(201).json({ sucess: true, notification })
    } catch (error) {
        return res.status(500).json({ sucess: false, message: 'Server Error' });
    }
}


exports.getNotification = async (req, res) => { //fetching notification for a specific user 
    const { userId } = req.params;

    try {
        const notification = await Notification.find({ userId });
        return res.status(200).json(notification);
    } catch (error) {
        return res.status(500).json({ sucess: false, message: "Server Error" })
    }
}  