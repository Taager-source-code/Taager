import userWallet from '../../../common/infrastructure/db/schemas/userWallet.model';

export const addUserWallet = body => userWallet.create(body);
export const findUserWalletById = id => userWallet.findById(id).exec();
export const findUserWallet = (query, session = null) =>
  userWallet
    .find(query)
    .session(session)
    .exec();
export const findUserWalletByIdAndUpdate = ({ id, update, options, lean = true }) =>
  userWallet
    .findByIdAndUpdate(id, update, options)
    .lean(lean)
    .exec();


