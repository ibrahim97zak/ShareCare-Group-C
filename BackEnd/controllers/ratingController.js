import Rating from '../models/Rating.js';

export async function createRating(req, res) {
    try {
        const { ratedId, donationId, score, comment } = req.body;
        
        const newRating = new Rating({
            raterId: req.user.id,
            ratedId,
            donationId,
            score,
            comment
        });
        
        await newRating.save();
        res.status(201).json(newRating);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

export async function getAllRatings(req, res) {
    try {
        const ratings = await Rating.find()
            .populate('raterId', 'name') 
            .populate('ratedId', 'name') 
            .populate('donationId', 'donationType'); 

        res.json(ratings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

export async function getRatingById(req, res) {
    try {
        const rating = await Rating.findById(req.params.id)
            .populate('raterId', 'name')
            .populate('ratedId', 'name')
            .populate('donationId', 'donationType');

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        res.json(rating);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

export async function updateRating(req, res) {
    try {
        const rating = await Rating.findById(req.params.id);

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        if (rating.raterId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this rating' });
        }

        const { score, comment } = req.body;
        rating.score = score || rating.score;
        rating.comment = comment || rating.comment;

        await rating.save();
        res.json(rating);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

export async function deleteRating(req, res) {
    try {
        const rating = await Rating.findById(req.params.id);

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        if (rating.raterId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this rating' });
        }

        await rating.remove();
        res.json({ message: 'Rating removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
