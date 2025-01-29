import { Router } from 'express';
import { addNurse, getNurses, deleteNurse, loginNurse } from '../controller/nurseController.js';
const router = Router();

router.post('/', addNurse);
router.get('/', getNurses);
router.delete('/:nurseId', deleteNurse);
router.post('/login', loginNurse);

export default router;