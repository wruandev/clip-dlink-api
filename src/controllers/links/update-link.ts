import { Request, Response } from 'express';

import { ShortLink } from '../../models';
import { asyncFn, dateUtils } from './../../utils';
import { checkSlugExist } from './slug-validation';
import { z } from 'zod';

const updateLinkSchema = z.object({
  url: z
    .string({ required_error: 'URL is required' })
    .url('URL is required and must be a proper URL'),
  slug: z
    .union([
      z.string().min(4, { message: 'Custom ID must be 4 or more characters long' }),
      z.string().length(0),
    ])
    .optional()
    .transform((e) => (e === '' ? undefined : e)),
});

const updateLink = asyncFn(async (req: Request, res: Response) => {
  const { url, slug } = req.body;
  const { id } = req.params;

  const validated = updateLinkSchema.safeParse({ url, slug });

  if (!validated.success) {
    return res.status(400).json({
      status: 'error',
      error: validated.error.flatten().fieldErrors,
    });
  }

  if (!id) {
    throw new Error('id must not empty');
  }

  const dataDB = await ShortLink.query()
    .select('shortlinkId as id', 'fullUrl as url', 'slug')
    .where({
      userId: req.user?.id,
    })
    .findById(id);

  if (!dataDB) {
    throw new Error('Data not found');
  }

  if (
    validated.data.slug &&
    validated.data.slug !== dataDB.slug &&
    (await checkSlugExist(validated.data.slug))
  ) {
    throw new Error('Slug has already taken');
  }

  const dataUpdated = await ShortLink.query()
    .select('shortlinkId as id', 'fullUrl as url', 'slug')
    .where({
      userId: req.user?.id,
    })
    .updateAndFetchById(id, {
      fullUrl: validated.data.url,
      slug: validated.data.slug,
      updatedAt: dateUtils.mysqlDate(),
    });

  if (!dataUpdated) {
    throw new Error('Failed to update data');
  }

  return res.json({
    status: 'success',

    data: {
      id: dataUpdated.shortlinkId,
      url: dataUpdated.fullUrl,
      slug: dataUpdated.slug,
      createdAt: dataUpdated.createdAt,
      updatedAt: dataUpdated.updatedAt,
    },
  });
});

export { updateLink };
