const router = require('express').Router();
const { 
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction    
} = require('../../controllers/thought-controller');

// /api/thoughts
router
    .route('/')
    .get(getAllThoughts)
    .post(createThought);

// /api/thoughts/:id
router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought)
    .post(addReaction)

// /api/thoughts/<thoughtId>/<reactionId>
router
    .route('/:thoughtId/:reactionId')
    .delete(removeReaction)

module.exports = router;
