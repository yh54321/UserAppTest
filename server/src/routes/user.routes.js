import express from 'express';
import { create, get, deleteUser } from '../controllers/user.controller.js'

const router = express.Router();

router.post('/create/:account', create);
router.get('/get/:account', get);
router.delete('/delete/:account/:id', deleteUser);

export default router;
