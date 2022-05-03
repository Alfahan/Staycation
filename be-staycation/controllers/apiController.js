const Item = require('../models/Item');

module.exports = {
    landingPage: async (req, res) => {
        try {
            const mostPicted = await Item.find()
                .select(' _id title country city price unit imageId ')
                .limit(5);
            res.status(200).json({ mostPicted })
        } catch (err) {
            
        }
    }
}