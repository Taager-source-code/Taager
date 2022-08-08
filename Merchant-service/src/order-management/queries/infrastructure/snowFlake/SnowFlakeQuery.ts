/**
 *
 * @member {String} query
 * @member {Array} bind
 * SnowFlakeQuery
 */
export default class SnowFlakeQuery {
  bind: any;
  query: any;
  constructor(query, bind) {
    this.query = query;
    this.bind = bind;
  }
}


