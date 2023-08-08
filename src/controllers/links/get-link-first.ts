import { Request, Response } from 'express';

import { ShortLink } from '../../models';
import { asyncFn } from '../../utils';

const getLinkFirst = asyncFn(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const data = await ShortLink.query()
    .select('shortlinkId as id', 'fullUrl as url', 'slug', 'createdAt', 'updatedAt')
    .where({
      userId: req.user?.id,
      slug: slug,
    })
    .first();

  if (!data) {
    return res.status(404).json({
      status: 'error',
    });
  }

  return res.json({
    status: 'success',
    data,
  });
});

export { getLinkFirst };
