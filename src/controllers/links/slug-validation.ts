import { ShortLink } from './../../models';

const checkSlugExist = async (slug: string): Promise<boolean> => {
  const checkSlug = await ShortLink.query()
    .select('shortlinkId', 'slug')
    .where({ slug: slug })
    .limit(1);

  return checkSlug.length > 0;
};

export { checkSlugExist };
