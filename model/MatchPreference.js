const mongoose = require('mongoose');


const matchPreferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    degreeProgram: {
        type: String,
        enum: ["IT", "Business"],
        required: true
    },
    ITDegree: {
        type: [string],
        enum: [
            'BSc (hons) Computing',
            'BSc (Hons) Computer Networking and IT Security',
            'BSc (Hons) Multimedia Technology',
            'BSc (Hons) Computing with Artificial Intelligence'
        ],
        default: []
    },
    BusinessDegree: {
        type: [String],
        enum: [
            'BA (Hons) Business Administration',
            'BBA with Specialisation in Digital Business Management',
            'BBA (International Business) in Nepal',
            'BBA with Specialisation in Advertising and Marketing',
            'BBA with Specialisation in Events and Tourism Management',
            'BA (Hons) Accounting and Finance'
        ],
        default: []
    }, 

    studyPreference :{
        availability: String,  // this is like morning evening night etc
        timezone:{
            type:String,
            default: 'GMT+5:45' // Fixed to Nepal's time zone
        },
        preferredStudyFormat: String // e.g., 'Virtual', 'In-person'
    },
    bio:{
        interest: [String], 
        matched:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    }
}, {timestamps: true})


const MatchPreference = mongoose.model("MatchPreference", matchPreferenceSchema); 


module.exports = MatchPreference; 