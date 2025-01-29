import { Router } from 'express';
import { addPatient, getPatient, deletePatient, loginPatient } from '../controller/patientController.js';
const router = Router();

router.post('/', addPatient);
router.get('/', getPatient);
router.delete('/:patientId', deletePatient);
router.post('/login', loginPatient);


export default router;