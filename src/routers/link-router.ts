import { Router } from 'express';
import { LinkController } from './../controllers';
import { checkAuth } from './../middlewares/auth-middleware';

const router = Router();

router.get('/', checkAuth, LinkController.getLinks);

router.get('/public/:slug', LinkController.getLinkFirstPublic);

router.get('/:slug', checkAuth, LinkController.getLinkFirst);

router.post('/', checkAuth, LinkController.saveLink);

router.post('/public', LinkController.saveLinkPublic);

router.put('/:id', checkAuth, LinkController.updateLink);

router.delete('/:id', checkAuth, LinkController.deleteLink);

export { router };
