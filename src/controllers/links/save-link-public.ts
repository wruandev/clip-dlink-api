import { Request, Response } from 'express';

import { ShortLink } from '../../models';
import { asyncFn } from '../../utils';
import { v4 as uuidv4 } from 'uuid';
import { appConfig } from './../../configs';
import { nanoid } from './../../dynamic-imports';
import { checkSlugExist } from './slug-validation';
import { z } from 'zod';

const saveLinkSchema = z.object({
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

const { customAlphabet } = nanoid;

const saveLinkPublic = asyncFn(async (req: Request, res: Response) => {
  const { url, slug } = req.body;

  const validated = saveLinkSchema.safeParse({ url, slug });

  if (!validated.success) {
    return res.status(400).json({
      status: 'error',
      error: validated.error.flatten().fieldErrors,
    });
  }

  const id = uuidv4();
  const nanoid = await customAlphabet(appConfig.nanoidCustomAlphabet, appConfig.urlSlugLength);

  const urlSlug = validated.data.slug ? validated.data.slug : nanoid();

  if (await checkSlugExist(urlSlug)) {
    throw new Error('Slug has already taken');
  }

  const dataSaved = await ShortLink.query()
    .select('shortlinkId as id', 'fullUrl as url', 'slug')
    .insertAndFetch({
      shortlinkId: id,
      fullUrl: validated.data.url,
      slug: urlSlug,
    });

  return res.json({
    status: 'success',

    data: {
      id: dataSaved.shortlinkId,
      url: dataSaved.fullUrl,
      slug: dataSaved.slug,
      createdAt: dataSaved.createdAt,
      updatedAt: dataSaved.updatedAt,
    },
  });
});

export { saveLinkPublic };
