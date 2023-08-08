import { Router } from 'express';
import { AuthController } from '../controllers';

const router: Router = Router();

router.post('/register', AuthController.registerUser);

router.post('/login', AuthController.loginUser);

export { router };
