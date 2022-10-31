const advancedResults = (model, populate) => async (req, res, next) => {
  console.log(req.query)

  // copy req. query to new object
  const reqQuery = { ...req.query }
  console.log(reqQuery)

  //exclude fields
  const removeFields = ['select', 'sort', 'page', 'limit']

  //loop over removeFields and delete from queryStr
  removeFields.forEach((param) => delete reqQuery[param])

  //create query string
  let queryStr = JSON.stringify(reqQuery)
  console.log(queryStr)

  //create operator gt, gte, lt etc
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  console.log(`result : ${queryStr}`)

  //using mongodb string find query find({ "averageCost" : {"$lte": "1000"}, "location.city": "boston" "})
  query = model.find(JSON.parse(queryStr))

  //select process
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    console.log(fields) // "name description" sintaks for mongoose query

    query = query.select(fields)
  }

  //sortby or default(using date)
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy) //default ascending
  } else {
    query = query.sort('-createdAt') // descending
  }

  const page = parseInt(req.query.page, 10) || 1 //selected page
  const limit = parseInt(req.query.limit, 10) || 25 //show n-th items
  const startIndex = (page - 1) * limit //skip several items , ex. page 2 will start from 6th item.
  const endIndex = page * limit //last index of total item fetch
  const total = await model.countDocuments() //total document to fetch

  //pagination skip and limit function
  query = query.skip(startIndex).limit(limit)

  //make generic populate function and value
  if (populate) {
    query = query.populate(populate)
  }

  //execute query
  const results = await query

  const pagination = {}

  //if last index item (in page) less then total - still have amount
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    }
  }

  //if startIndex in page 1 or begin indexing
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  }

  next()
}

module.exports = advancedResults
