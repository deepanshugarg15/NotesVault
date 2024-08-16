const express = require("express");
const router = express.Router();
var fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//Route 1: Get all the notes using: Get "/api/notes/fetchallnotes". Login Required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Some error ocurred" });
  }
});

//Route 2: Add a new note using: Post "/api/notes/addnote". Login Required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Title must be atleast 3 characters").isLength({ min: 3 }),

    body("description", "Description must be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //If there are errors, then return a bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const saveData = await note.save();
      res.json(saveData);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Some error ocurred" });
    }
  }
);

//Route 3: Update an existing Note using: Post "/api/notes/updatenote". Login Required
router.put(
  "/updatenote/:id",
  fetchUser,
  [
    body("title", "Title must be atleast 3 characters").isLength({ min: 3 }),

    body("description", "Description must be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;

    try {
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      //Find the Note to be Updated
      let note = await Notes.findById(req.params.id);
      if (!note) {
        res.status(404).send("Not Found");
      }

      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }

      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json({ note });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Some error ocurred" });
    }
  }
);

//Route 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login Required
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    //Find the Note to be Deleted
    let note = await Notes.findById(req.params.id);
    if (!note) {
      res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Some error ocurred" });
  }
});

module.exports = router;
