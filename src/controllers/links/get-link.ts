import { Request, Response } from 'express';

import { ShortLink } from '../../models';
import { asyncFn } from '../../utils';

const getLinks = asyncFn(async (req: Request, res: Response) => {
  const { sort, page, limit } = req.query;
  let limitNum = 10;
  let pageNum = 1;

  if (limit && !parseInt(limit as string)) {
    throw new Error('Limit must be Integer');
  }

  if (limit && parseInt(limit as string)) {
    limitNum = parseInt(limit as string);
  }

  let data = ShortLink.query()
    .select('shortlinkId as id', 'fullUrl as url', 'slug', 'createdAt', 'updatedAt', 'visited')
    .where({
      userId: req.user?.id,
    });

  if (sort && sort === 'name') {
    data = data.orderBy('slug', 'ASC');
  }

  if (sort && sort === 'date') {
    data = data.orderBy('createdAt', 'DESC');
  }

  if (page && !parseInt(page as string)) {
    throw new Error('Page must be integer');
  }

  if (page) {
    pageNum = parseInt(page as string);
    const offset = (pageNum - 1) * limitNum;

    data = data.offset(offset);
  }

  const resData = await data.limit(limitNum);
  const totalData = await ShortLink.knexQuery().count('shortlinkId', { as: 'total' }).where({
    userId: req.user?.id,
  });

  const mostVisited = await ShortLink.knexQuery()
    .max('visited', { as: 'mostVisitedCount' })
    .where({
      userId: req.user?.id,
    })
    .groupBy('userId');

  return res.json({
    status: 'success',
    data: resData,
    pagination: {
      total: totalData[0].total,
      page: pageNum,
      limit: limitNum,
    },
    extra: {
      mostVisitedCount: mostVisited[0].mostVisitedCount,
    },
  });
});

export { getLinks };
