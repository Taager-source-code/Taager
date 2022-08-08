import User from '../../../common/infrastructure/db/schemas/user.model';
export async function findUserById(id) {
  const user = await User.findById(id).exec();
  if (user == null) throw new Error('User not Found');
  return user;
}

export const findAllUsers = (query, page = 0, pageSize = 100, lean = true) =>
  User.find(query)
    .limit(pageSize)
    .skip(pageSize * page)
    .lean(lean)
    .exec();
export const findUser = (query, lean = true) =>
  User.findOne(query)
    .lean(lean)
    .exec();
export const findUserForLogin = (query, lean = true) =>
  User.findOne(query, {
    __v: 0,
    password: 0,
    verificationToken: 0,
    resetPasswordToken: 0,
    resetPasswordTokenExpiry: 0,
    resetWalletPasswordToken: 0,
    resetWalletPasswordTokenExpiry: 0,
    walletPassword: 0,
    verificationTokenExpiry: 0,
    userRole: 0,
    loyaltyChange: 0,
    InProcessProfit: 0,
    collectedProfit: 0,
    listedProducts: 0,
    userCollection: 0,
    userReferrals: 0,
  })
    .lean(lean)
    .exec();
export const findUserPassword = (query, lean = true) =>
  User.findOne(query, { password: 1, walletPassword: 1 })
    .lean(lean)
    .exec();
export const findUsers = (query, lean = true) =>
  User.find(query)
    .lean(lean)
    .exec();
export const countUsers = query => User.countDocuments(query).exec();
export const createUser = body => User.create(body);

export const save = userModel => User.findOneAndReplace({ _id: userModel._id }, userModel).exec();

export const findUserByIdAndUpdate = async ({ id, update, options = {}, lean = true }) =>
  await User.findByIdAndUpdate(id, update, options)
    .lean(lean)
    .exec();

export const findUserAndUpdate = ({ query, update, options = {}, lean = true }) =>
  User.findOneAndUpdate(query, update, options)
    .lean(lean)
    .exec();
export const findUserAndRemove = ({ query, lean = true }) =>
  User.findOneAndDelete(query)
    .lean(lean)
    .exec();
export const getAllActiveUsers = () =>
  User.aggregate([
    {
      $lookup: {
        from: 'orders', // collection name in db
        localField: '_id',
        foreignField: 'orderedBy',
        as: 'orders',
      },
    },
  ]).exec();


