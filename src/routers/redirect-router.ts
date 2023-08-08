import { Router, Request, Response } from 'express';
import { asyncFn } from '../utils';
import { ShortLink } from '../models';

const router: Router = Router();

router.get(
  '/:slug',
  asyncFn(async (req: Request, res: Response) => {
    const { slug } = req.params;

    if (!slug) {
      throw new Error('Slug is required');
    }

    const data = await ShortLink.query().findOne({ slug: slug });

    if (!data) {
      return res.redirect('/notfound');
    }

    await ShortLink.query()
      .findById(data.shortlinkId)
      .patch({
        visited: data.visited + 1,
      });

    return res.redirect(data.fullUrl);
  }),
);

export { router };
