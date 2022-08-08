import { Mapper } from '@core/base/mapper';
import { CategoryModel } from '@core/domain/variant-group.model';
import { CategoryListEntity } from '../entities/variant-group-entity';
export class CategoryRepositoryMapper extends Mapper<CategoryListEntity, CategoryModel[]>{
  mapFrom(param: CategoryListEntity): CategoryModel[] {
    return param.data.map((item) => ({
      _id: item._id,
      country: item.country,
      icon: item.icon,
      featured: item.featured,
      name: {
        arName: item.text,
        enName: item.name,
      },
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }
  mapTo(categories: CategoryModel[]): CategoryListEntity {
    return ({
      data: categories.map(item => ({
        _id: item._id,
        country: item.country,
        icon: item.icon,
        featured: item.featured,
        text: item.name.arName,
        name: item.name.enName,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      msg: '',
    });
  }
}
