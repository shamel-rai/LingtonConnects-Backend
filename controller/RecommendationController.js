const Recommendation = require('../model/RecommendationModel');
const User = require('../model/Usermodel')

exports.getRecommendation = async (userId) => {
    const user = await User.findById(userId).populate('connections');
    if (!user) throw new Error('User not Found')

    const recommendations = [];

    const allRecommendation = await Recommendation.find();

    for (const recommendation of allRecommendation) {

        const isConnected = recommendation.connections.includes(userId); //checking if the user is already connected with the recommendated person

        if (!isConnected) {
            //finding mutual connection
            const mutualConnection = recommendation.connections.filter(conn => conn.toString() !== userId)  //will exclude the user themselves

            if (mutualConnection.length > 0) {
                recommendation.push({
                    name: recommendation.name,
                    interests: recommendation.interest,
                    mutualConnection: mutualConnection.length,
                })
            }
        }
    }
    return recommendations;

}


exports.getAllRecommendations = async () => {
    try {
        const recommendations = await Recommendation.find().populate('connections');
        res.status(200).json({
            sucess: true,
            recommendations
        })
    } catch (error) {
        res.status(500).json({ error: 'An error occured while fetchiing all the recommendation' })
    }

}