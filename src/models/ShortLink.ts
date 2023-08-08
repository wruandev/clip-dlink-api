import { Model } from 'objection';

class ShortLink extends Model {
  static get tableName() {
    return 'shortlinks';
  }

  static get idColumn() {
    return 'shortlinkId';
  }

  shortlinkId!: string;
  fullUrl!: string;
  slug!: string;
  createdAt!: string;
  updatedAt!: string;
  visited!: number;
  userId!: string;
}

export { ShortLink };
