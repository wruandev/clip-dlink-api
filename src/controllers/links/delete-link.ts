import { Request, Response } from 'express';

import { ShortLink } from '../../models';
import { asyncFn } from '../../utils';

const deleteLink = asyncFn(async (req: Request, res: Response) => {
  const { id } = req.params;

  const dataDB = await ShortLink.query()
    .select('shortlinkId as id', 'fullUrl as url', 'slug')
    .where({
      userId: req.user?.id,
    })
    .findById(id);

  if (!dataDB) {
    throw new Error('Data not found');
  }

  const deleted = await ShortLink.query()
    .where({
      userId: req.user?.id,
    })
    .deleteById(id);

  if (!deleted) {
    throw new Error('Failed to delete data');
  }

  return res.json({
    status: 'success',

    data: dataDB,
  });
});

export { deleteLink };
