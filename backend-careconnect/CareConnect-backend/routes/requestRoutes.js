import {Router} from "express"
import {addRequest, getRequest, deleteRequest} from "../controller/requestController.js"

const router = Router();

router.post('/', addRequest);
router.get('/', getRequest);
router.delete('/:id', deleteRequest);

export default router;