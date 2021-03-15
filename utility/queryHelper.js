class QueryHelper {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    
    const excludedFields = ["currentPage", "perPage"];
    excludedFields.forEach((el) => delete queryObj[el]);

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginate() {
    const currentPage = this.queryString.currentPage * 1 || 1;
    const perPage = this.queryString.perPage * 1 || 15;
    const skip = (currentPage - 1) * perPage;

    this.query = this.query.skip(skip).limit(perPage);

    return this;
  }
}
module.exports = QueryHelper;
