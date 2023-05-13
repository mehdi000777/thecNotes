import express from 'express';
import { createNote, deleteNote, getAllNotes, updateNote } from '../controllers/notesController.js';
import verifyJWT from '../middlewares/verifyJwt.js';

const router = express.Router();

router.use(verifyJWT);

router.route('/')
    .get(getAllNotes)
    .post(createNote)
    .patch(updateNote)
    .delete(deleteNote)

export default router;