import Note from "../models/Note.js";
import asyncHandler from 'express-async-handler';
import User from "../models/User.js";

export const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean().populate('user', 'username');
    if (!notes?.length) return res.status(400).json({ message: 'No notes found' });

    res.status(200).json(notes);
})

export const createNote = asyncHandler(async (req, res) => {
    const { title, text, userId } = req.body;

    if (!title || !text || !userId) res.status(400).json({ message: 'All fields are required' });

    const user = await User.findById(userId).lean().exec();
    if (!user) return res.status(400).json({ message: 'User not found' });

    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate) return res.status(400).json({ message: 'Duplicate note title' });

    const newNote = new Note({
        title,
        text,
        user: userId
    });

    await newNote.save();

    res.status(201).json({ message: `Note ${newNote.title} created` });
})

export const updateNote = asyncHandler(async (req, res) => {
    const { id, title, text, userId, completed } = req.body;

    if (!id || !title || !text || !userId || typeof completed !== 'boolean') return res.status(400).json({ message: 'All fields are requierd' });

    const note = await Note.findById(id).exec();
    if (!note) return res.status(400).json({ message: 'Note not found' });

    const user = await User.findById(userId).lean().exec();
    if (!user) return res.status(400).json({ message: 'User not found' });

    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) return res.status(400).json({ message: 'Duplicate note title' })

    note.title = title;
    note.text = text;
    note.user = userId;
    note.completed = completed;

    const updatedNote = await note.save();

    res.status(200).json({ message: `Note ${updatedNote.title} updated` });
})

export const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) return res.status(400).json({ message: 'Note ID required' });

    const note = await Note.findById(id).exec();
    if (!note) return res.status(400).json({ message: 'Note not found' });

    const result = await note.deleteOne();

    res.status(200).json({ message: `Note ${result.title} with ID ${result._id} deleted` });
})