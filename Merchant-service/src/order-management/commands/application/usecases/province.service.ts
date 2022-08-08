import Province from '../../../common/infrastructure/db/schemas/ProvinceSchema';

export const findProvinceByName = (province, lean = false) =>
  Province.find({ location: province, isActive: true })
    .lean(lean)
    .exec();


