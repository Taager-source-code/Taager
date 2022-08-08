import userPrivileges from '../../../common/infrastructure/db/schemas/userPrivileges.model';

export const findAndDeleteUserPrivileges = id => userPrivileges.findByIdAndDelete(id);
export const addUserPrivileges = body => userPrivileges.create(body);
export const findUserPrivilegesById = id => userPrivileges.findById(id).exec();
export const findUserPrivileges = query => userPrivileges.find(query).exec();
export const findUserPrivilegesByIdAndUpdate = ({ id, update, options, lean = true }) =>
  userPrivileges
    .findByIdAndUpdate(id, update, options)
    .lean(lean)
    .exec();


