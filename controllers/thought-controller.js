  
const { Thought, User } = require('../models');

const thoughtController = {
    //get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: 'user',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        });
    },
    //get one thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'user',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            })
    },
    //create a thought
    createThought({ params, body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findByIdAndUpdate(
                    { _id: params.thoughtId},
                    { username: body.username },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(({ _id, _doc }) => {
                return User.findOneAndUpdate(
                    { username: body.username },
                    { $push: { thoughts: _id } },
                ).then(res.json(_doc))
            })
            .catch(err => res.status(400).json(err));
    },
    //update one thought by id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(updatedThought => {
            if (!updatedThought) {
                res.status(404).json({ message: 'No thought with this ID!' });
                return;
            }
            res.json(updatedThought);
        })
        .catch(err => res.json(err));
    },
    //delete one thought by id
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(deletedThought => {
            if (!deletedThought) {
                res.status(404).json({ message: 'No thought with this ID!'});
                return;
            }
            res.json(deletedThought);
        })
        .catch(err => res.json(err));
    },
    //add reaction to one thought by thoughtId
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
          { _id: params.id },
          { $push: {reactions: body } },
          { new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
    //remove reaction from one thought by thoughtId
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    }
};

//export thoughtController
module.exports = thoughtController;