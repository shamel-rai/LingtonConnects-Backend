const User = require('../model/Usermodel')
const jwt = require('jsonwebtoken');


const secret = process.env.JWT_SECRET;
const expire = process.env.JWT_EXPIRE;
const cookieExpire = process.env.JWT_COOKIE_EXPIRE;

const signToken = id => {
    return jwt.sign({ id }, secret, { expiresIn: expire })
}

const tokenGen = (user, statusCode, res) => {
    const token = signToken(user._id);

    user.password = undefined  //to remove the user password from the output 



    res.status(statusCode).json({
        status: 'success',
        access_Token: token,
        user
    })

}

exports.signup = async (req, res) => {
    const { firstName, lastName, username, email, password, confirmPassword } = req.body;
    try {
        const allowedEmail = '@islingtoncollege.edu.np';
        if (!email.endsWith(allowedEmail)) {
            return res.status(400).json({ message: 'Please enter your ING email!!' })
        }

        if (password != confirmPassword) {
            return res.json({ message: 'Password does not match' })
        }

        const existingUserByEmail = await User.findOne({ email });
        const existingUserByUsername = await User.findOne({ username });

        if (existingUserByEmail || existingUserByUsername) {
            return res.status(400).json({
                message: 'User already exists with the provided email or username'
            })
        }

        const newUser = new User({
            firstName,
            lastName,
            username,
            displayName: `${firstName} ${lastName}`,
            email,
            password,
        })

        await newUser.save();

        res.status(201).json({
            message: 'Registration Sucesssful',
            user: newUser
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}


exports.login = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!email && !username || !password) {
            return res.status(400).json({ message: 'Please provide email or username and password' });
        }
        const user = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        }).select("+password");

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }
        tokenGen(user, 200, res);

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message || error });
    }
};

exports.signout = async (req, res) => {
    res.clearCookie('access_token')

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
}
