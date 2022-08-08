import { Service } from 'typedi';

import mongoose from 'mongoose';
import { VariantGroupModel } from '../models/VariantGroupModel';

import VariantGroup from '../schemas/VariantGroupModel';
import {
  SearchVariantGroupsParameters,
  SearchVariantGroupsResult,
} from '../../../application/models/variant/SearchVariantGroupsResult';
@Service({ global: true })
export default class VariantGroupDao {
  async getVariantGroup(id): Promise<VariantGroupModel | null> {
    return VariantGroupDao.getVariantGroupInternal({
      _id: mongoose.Types.ObjectId(id),
    });
  }

  async getByVariantId(id): Promise<VariantGroupModel | null> {
    return VariantGroupDao.getVariantGroupInternal({
      variants: mongoose.Types.ObjectId(id),
    });
  }

  private getSearchFilter(query: SearchVariantGroupsParameters) {
    const { query: term, country, userId, commercialCategoryIds = [] } = query;
    const simpleFilters = {
      'embeddedVariants.isExpired': false,
      country,
    };
    if (commercialCategoryIds.length > 0) {
      simpleFilters['commercialCategoryIds'] = { $in: commercialCategoryIds };
    }

    return {
      $and: [
        {
          $or: [
            { 'embeddedVariants.productName': { $regex: term, $options: 'i' } },
            { 'embeddedVariants.productDescription': { $regex: term, $options: 'i' } },
            { 'embeddedVariants.prodID': { $regex: term, $options: 'i' } },
          ],
        },
        {
          $or: [
            { visibleToSellers: [] },
            { visibleToSellers: { $elemMatch: { $eq: mongoose.Types.ObjectId(userId) } } },
          ],
        },
        simpleFilters,
      ],
    };
  }

  private getSearchProjection() {
    return {
      'variants.prodID': 1,
      'variants._id': 1,
      'variants.attributes': 1,
      category: 1,
      commercialCategoryIds: 1,
      attributeSets: 1,
      primaryVariant: 1,
      country: 1,
    };
  }

  private getSearchSort(sortBy: string) {
    return {
      isAvailable: -1,
      [`primaryVariant.${sortBy}`]: -1,
      updatedAt: -1,
    };
  }

  async optimizedSearch(query: SearchVariantGroupsParameters): Promise<SearchVariantGroupsResult> {
    const { page, pageSize, sortBy, countable } = query;
    const skip = (page - 1) * pageSize;
    const sort = this.getSearchSort(sortBy);
    const filter = this.getSearchFilter(query);
    const projection = this.getSearchProjection();

    const aggregationQueryStart = VariantGroup.aggregate()
      .match(filter)
      .addFields({
        variants: '$embeddedVariants',
      })
      .addFields({
        isAvailable: VariantGroupDao.isAnyProductAvailable(),
      })
      .lookup({
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category',
      });

    const aggregationQuery = VariantGroupDao.addCategorySearch(aggregationQueryStart, query);
    const results = await aggregationQuery
      .lookup({
        from: 'products',
        localField: 'primaryVariant',
        foreignField: '_id',
        as: 'primaryVariant',
      })
      .unwind({
        path: '$primaryVariant',
        preserveNullAndEmptyArrays: false,
      })
      .addFields(VariantGroupDao.filterExpiredProducts())
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .project(projection);

    if (countable) {
      const aggregationCount = await aggregationQuery.count('count');
      const count = (aggregationCount[0] && aggregationCount[0].count) || 0;
      return { results, count };
    } else {
      return { results };
    }
  }

  async search(searchQuery: SearchVariantGroupsParameters): Promise<SearchVariantGroupsResult> {
    const sorting = {
      [`primaryVariant.${searchQuery.sortBy}`]: -1,
      updatedAt: -1,
    };
    const skip = (searchQuery.page - 1) * searchQuery.pageSize;

    const results = await this.constructQuery(searchQuery)
      .addFields({
        isAvailable: VariantGroupDao.isAnyProductAvailable(),
      })
      .addFields({
        orderCount: { $sum: '$variants.orderCount' },
      })
      .sort({ isAvailable: -1, ...sorting })
      .project({
        'variants.prodID': 1,
        'variants._id': 1,
        'variants.attributes': 1,
        category: 1,
        commercialCategoryIds: 1,
        attributeSets: 1,
        primaryVariant: 1,
        country: 1,
      })
      .skip(skip)
      .limit(searchQuery.pageSize)
      .exec();

    if (searchQuery.countable) {
      const count = await this.constructQuery(searchQuery)
        .count('count')
        .exec();

      return { results, count: (count[0] && count[0].count) || 0 };
    }

    return { results };
  }

  private constructQuery(searchQuery: SearchVariantGroupsParameters) {
    const lookupAggregateStart = VariantGroup.aggregate()
      .match({ country: searchQuery.country })
      .lookup({
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category',
      });

    const lookupAggregate = VariantGroupDao.addCategorySearch(lookupAggregateStart, searchQuery)
      .lookup({
        from: 'products',
        localField: 'variants',
        foreignField: '_id',
        as: 'variants',
      })
      .addFields(VariantGroupDao.filterExpiredProducts())
      .lookup({
        from: 'products',
        localField: 'primaryVariant',
        foreignField: '_id',
        as: 'primaryVariant',
      })
      .unwind({
        path: '$primaryVariant',
        preserveNullAndEmptyArrays: false,
      })
      .match(VariantGroupDao.variantVisibleToSeller(searchQuery.userId))
      .match({
        variants: {
          $elemMatch: VariantGroupDao.variantNotExpired(),
        },
      });

    VariantGroupDao.addCommercialCategorySearch(lookupAggregate, searchQuery);

    return VariantGroupDao.addSearch(lookupAggregate, searchQuery);
  }

  private static async getVariantGroupInternal(query): Promise<VariantGroupModel | null> {
    const result = await VariantGroup.aggregate()
      .match(query)
      .lookup({
        from: 'products',
        localField: 'variants',
        foreignField: '_id',
        as: 'variants',
      })
      .addFields(VariantGroupDao.filterExpiredProducts())
      .addFields({
        primaryVariant: {
          $filter: {
            input: '$variants',
            as: 'item',
            cond: { $eq: ['$$item._id', '$primaryVariant'] },
          },
        },
      })
      .unwind({
        path: '$primaryVariant',
        preserveNullAndEmptyArrays: false,
      })
      .project({
        _id: 1,
        'variants._id': 1,
        'variants.attributes': 1,
        'variants.prodID': 1,
        'primaryVariant._id': 1,
        'primaryVariant.attributes': 1,
        'primaryVariant.prodID': 1,
        attributeSets: 1,
        country: 1,
        commercialCategoryIds: 1,
      })
      .exec();

    if (!result.length) return null;
    return result[0];
  }

  private static addOptimizedCategorySearch(lookupAggregateStart, searchQuery: SearchVariantGroupsParameters) {
    if (searchQuery.category) {
      return lookupAggregateStart.match({
        'category.text': searchQuery.category,
      });
    }
    return lookupAggregateStart;
  }

  private static addCategorySearch(lookupAggregateStart, searchQuery: SearchVariantGroupsParameters) {
    if (searchQuery.category) {
      return lookupAggregateStart.match({
        'category.text': searchQuery.category,
      });
    }
    return lookupAggregateStart;
  }

  private static addCommercialCategorySearch(aggregate, searchQuery: SearchVariantGroupsParameters) {
    if (searchQuery.commercialCategoryIds && searchQuery.commercialCategoryIds.length > 0) {
      return aggregate.match({
        commercialCategoryIds: { $in: searchQuery.commercialCategoryIds },
      });
    }
    return aggregate;
  }

  private static addSearch(aggregate, searchQuery) {
    const { query } = searchQuery;
    if (query && query.length > 0) {
      return aggregate.match({
        variants: {
          $elemMatch: {
            $or: [
              VariantGroupDao.prodIdContains(query),
              VariantGroupDao.productNameContains(query),
              VariantGroupDao.productDescriptionContains(query),
            ],
          },
        },
      });
    }

    return aggregate;
  }

  private static prodIdContains(query) {
    return {
      prodID: {
        $regex: query,
        $options: 'i',
      },
    };
  }

  private static productNameContains(query) {
    return {
      productName: {
        $regex: query,
        $options: 'i',
      },
    };
  }

  private static productDescriptionContains(query) {
    return {
      productDescription: {
        $regex: query,
        $options: 'i',
      },
    };
  }

  private static filterExpiredProducts() {
    return {
      variants: {
        $filter: {
          input: '$variants',
          cond: { $eq: ['$$this.isExpired', false] },
        },
      },
    };
  }

  private static variantNotExpired() {
    return {
      $or: [{ isExpired: false }, { isExpired: { $exists: false } }],
    };
  }
  private static variantVisibleToSeller(userId) {
    return {
      $or: [
        {
          visibleToSellers: {
            $in: [null, []],
          },
        },
        {
          visibleToSellers: {
            $elemMatch: {
              $eq: mongoose.Types.ObjectId(userId),
            },
          },
        },
      ],
    };
  }
  private static isAnyProductAvailable() {
    return {
      $reduce: {
        input: '$variants.productAvailability',
        initialValue: false,
        in: {
          $or: [
            '$$value',
            { $eq: ['$$this', 'available'] },
            { $eq: ['$$this', 'available_with_high_qty'] },
            { $eq: ['$$this', 'available_with_low_qty'] },
          ],
        },
      },
    };
  }
}


