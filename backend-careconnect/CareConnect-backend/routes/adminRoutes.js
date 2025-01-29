import { Router } from 'express';
import { verify_Admin } from '../controller/adminController.js';
const router = Router();

router.post('/', verify_Admin);

export default router;