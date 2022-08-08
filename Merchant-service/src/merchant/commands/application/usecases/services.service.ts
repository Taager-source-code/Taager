import Services from '../../../common/infrastructure/db/schemas/services.model';

export const addNewService = body => Services.create(body);
export const getService = query => Services.find(query).exec();
export const deleteService = query => Services.findOneAndDelete(query).exec();


