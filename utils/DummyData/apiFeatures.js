/* eslint-disable prefer-const */
/* eslint-disable node/no-unsupported-features/es-syntax */
class ApiFeatures {
  // Constructor initializes the query and request parameters
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery; // Mongoose query object
    this.queryString = queryString; // Query parameters from request
  }

  /**
   * 1️⃣ Filtering: Removes unwanted query parameters and applies filters.
   * Example:
   * URL: /api/v1/products?price[gte]=100&category=electronics
   * This will filter products where price is greater than or equal to 100 and category is 'electronics'.
   */
  filter() {
    const queryStringObj = { ...this.queryString };
    const excludesFields = [
      "page",
      "limit",
      "skip",
      "fields",
      "sort",
      "keyword",
    ];
    excludesFields.forEach((field) => delete queryStringObj[field]); // Remove excluded fields

    let queryString = JSON.stringify(queryStringObj);
    // Convert operators (gt, gte, lt, lte, in) into MongoDB format ($gt, $gte, etc.)
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Apply filters to the query
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryString));
    return this; // Return the instance for method chaining
  }

  /**
   * 2️⃣ Sorting: Allows sorting based on query parameters.
   * Example:
   * URL: /api/v1/products?sort=price,-createdAt
   * This will sort products by price (ascending) and by createdAt (descending).
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" "); // Convert comma-separated values to space-separated
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt"); // Default sorting by latest created items
    }
    return this;
  }

  /**
   * 3️⃣ Field Selection: Limits the fields returned in the response.
   * Example:
   * URL: /api/v1/products?fields=title,price,category
   * This will return only the specified fields.
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v"); // Exclude __v field by default
    }
    return this;
  }

  /**
   * 4️⃣ Searching: Performs a text search based on the "keyword" parameter.
   * Example:
   * URL: /api/v1/products?keyword=iphone
   * This will return products where the title or description contains "iphone".
   */
  search(model) {
    if (this.queryString.keyword) {
      let searchQuery = {}; // Initialize searchQuery object
      if (model === "Product") {
        searchQuery.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } }, // Case-insensitive search in title
          { description: { $regex: this.queryString.keyword, $options: "i" } }, // Case-insensitive search in description
        ];
      } else {
        searchQuery.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } }, // Case-insensitive search in title
        ];
      }

      this.mongooseQuery = this.mongooseQuery.find(searchQuery);
    }
    return this;
  }

  /**
   * 5️⃣ Pagination: Implements pagination based on page and limit parameters.
   * Example:
   * URL: /api/v1/products?page=2&limit=5
   * This will return the second page of results with 5 items per page.
   */
  paginate(countDocuments) {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    // pagination Result
    const pagination = {};
    pagination.currentPage = page;
    pagination.resultsPerPage = limit;
    pagination.totalPages = Math.ceil(countDocuments / limit); //
    if (endIndex < countDocuments) {
      pagination.nextPage = page + 1;
    }
    if (page > 0) {
      pagination.previousPage = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}

export default ApiFeatures;
