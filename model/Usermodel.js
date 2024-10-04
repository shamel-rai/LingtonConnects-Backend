const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        select: false
    },
    passwordChangedAt: Date

}, { timestamps: true })


userSchema.pre("save", async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    if (!this.isNew) {
        this.passwordChangedAt = Date.now();
    }
    next();
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema);

module.exports = User