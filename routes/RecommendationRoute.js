const express = require('express');
const auth = require('../middleware/authMiddleware');
const { getRecommendation, getAllRecommendations } = require('../controller/RecommendationController');


const router = express.Router();

router.route('/recommendations/:userId').get(auth, async (req, res) => {
    try {
        const recommendations = await getRecommendation(req.params.userId);
        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ error: "An error  occured while fetching the recommendations" })
    }
})

router.route('/recommendationds/all').get(auth, getAllRecommendations);
