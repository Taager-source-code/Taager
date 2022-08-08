export default class MongooseService {
  model: any;
  /**
   * @description Create an instance of the MongooseService class
   * @param Model {mongoose.model} Mongoose Model to use for the instance
   */
  constructor(Model) {
    this.model = Model;
  }

  /**
   * @description Retrieve multiple documents with pagination and sorted date from the Model with the provided
   *   query
   * @param query {object} - Query to be performed on the Model
   * @param {object} [page] Optional:
   * @param {object} [pageSize] - Optional argument to sort data
   * @param {object} [lean] -
   * @returns {Promise} Returns the results of the query
   */
  findWithPaginationAndSortedDate(query, page, pageSize, lean = true) {
    return this.model
      .find(query)
      .limit(pageSize)
      .skip(pageSize * page)
      .sort({ createdAt: -1 })
      .lean(lean)
      .exec();
  }

  /**
   * @description Update many documents matching the provided object, with the document
   * @param {object}
   * @returns {Promise} Returns the results of the query
   */
  updateMany({ query, update, lean = true }) {
    return this.model
      .updateMany(query, update)
      .lean(lean)
      .exec();
  }

  /**
   * @description Count the number of documents matching the query criteria
   * @param query {object} Query to be performed on the Model
   * @returns {Promise} Returns the results of the query
   */
  count(query) {
    return this.model.countDocuments(query).exec();
  }

  /**
   * @description Retrieve multiple documents from the Model with the provided query
   * @param query {object} - Query to be performed on the Model
   * @param {object} [lean] -
   * @returns {Promise} Returns the results of the query
   */
  findAll(query, lean = true) {
    return this.model
      .find(query)
      .lean(lean)
      .exec();
  }

  findAllWithPagination(query, page, pageSize, lean = true) {
    return this.model
      .find(query)
      .limit(pageSize)
      .skip(pageSize * page)
      .lean(lean)
      .exec();
  }

  create(document) {
    return this.model.create(document);
  }

  findById(id, projection = { __v: 0 }, lean = true) {
    return this.model
      .findById(id, projection)
      .lean(lean)
      .exec();
  }

  findByIdAndUpdate({ id, update, options, lean = true }) {
    return this.model
      .findByIdAndUpdate(id, update, options)
      .lean(lean)
      .exec();
  }

  save({ query, update, options = {}, lean = true }) {
    return this.model
      .updateOne(query, update, options)
      .lean(lean)
      .exec();
  }

  findWithLimitAndSortedDate(query, limit = 1, sort = { createdAt: -1 }, lean = true) {
    return this.model
      .find(query)
      .limit(limit)
      .sort(sort)
      .lean(lean)
      .exec();
  }

  update(id, document, options = { lean: true, new: true }) {
    return this.model.findByIdAndUpdate(id, document, options).exec();
  }

  findOne(query, options = { lean: true }, projection = { __v: 0 }) {
    return this.model
      .findOne(query, projection, options)
      .select({ __v: 0 })
      .exec();
  }
}


