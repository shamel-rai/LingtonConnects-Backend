const mongoose = require('mongoose');


const recommendationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    interest: { type: [String], default: [] }, // this is the array of interest
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });


const Recommendation = mongoose.model("Recommendation", recommendationSchema);

module.exports = Recommendation; 