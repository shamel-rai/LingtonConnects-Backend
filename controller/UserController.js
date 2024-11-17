const User = require('../model/Usermodel');

exports.updateUserProfile = async (req, res) => {
    try {
        const { username } = req.body;

        const userId = req.user.id;

        const updateUser = await User.findByIdAndUpdate(userId, {
            username, profilePicture
        }, { new: true, runValidators: true });

        if (!updateUser) {
            return res.status(404).json({ sucess: false, message: 'User not found' });
        };

        res.status(200).json({ message: "Profile updated successfully", user: updateUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId).select("+password");

        if (!user) {
            return res.status(404).json({ sucess: false, message: "User not found" })
        }

        const isMatch = await User.comparePassword(currentPassword); //Verifying the current password
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" })
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ sucess: false, message: "The password does not mactcgh" })
        }
        user.password = newPassword;
        await User.save();
    } catch (error) {
        return res.status(500).json({ message: "Error changing the password", error: error.message })
    }
}