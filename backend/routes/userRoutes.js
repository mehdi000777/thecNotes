import experss from 'express';
import { createUser, deleteUser, getAllUsers, updateUser } from '../controllers/usersController.js';
import verifyJWT from '../middlewares/verifyJwt.js';

const router = experss.Router();

router.use(verifyJWT);

router.route('/')
    .get(getAllUsers)
    .post(createUser)
    .patch(updateUser)
    .delete(deleteUser)

export default router;