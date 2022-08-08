import userRoles from '../../../common/infrastructure/db/schemas/userRoles.model';

export const findAndDeleteUserRoles = id => userRoles.findByIdAndDelete(id);
export const addUserRoles = body => userRoles.create(body);
export const findUserRolesById = id => userRoles.findById(id).exec();
export const findUserRoles = query => userRoles.find(query).exec();
export const findUserRolesByIdAndUpdate = ({ id, update, options, lean = true }) =>
  userRoles
    .findByIdAndUpdate(id, update, options)
    .lean(lean)
    .exec();


