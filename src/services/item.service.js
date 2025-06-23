const httpStatus = require("http-status");
const mongoosePaginate = require('mongoose-paginate-v2');
const { Item } = require("../models");
const ApiError = require("../utils/ApiError");

const createItem = async (itemBody) => {
  return Item.create({ ...itemBody });
};

const queryItems = async (filter, options) => {
  const query = { isDeleted: false };

  for (const key of Object.keys(filter)) {
    if (filter[key] !== "") {
      if (key === "itemName" || key === "brandName" || key === "category") {
        if (Array.isArray(filter[key])) {
          query[key] = { $in: filter[key].map(value => new RegExp(value, "i")) };
        } else {
          query[key] = { $regex: filter[key], $options: "i" };
        }
      } else if (key === "SKU" || key === "UPC") {
        query[key] = { $regex: filter[key], $options: "i" };
      } else if (key === "itemPrice") {
        query[key] = Number(filter[key]);
      } else if (key === "itemSize" && Array.isArray(filter[key])) {
        query[key] = { $in: filter[key] };
      } else {
        query[key] = filter[key];
      }
    }
  }

  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const itemsPromise = Item.find(query)
    .sort(options.sortBy)
    .skip(skip)
    .limit(limit);
  const countPromise = Item.countDocuments(query);

  const [items, totalItems] = await Promise.all([itemsPromise, countPromise]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    page,
    limit,
    totalPages,
    totalItems,
  };
};

const getItemCountByCategory = async () => {
  const categoryCounts = await Item.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);

  const formattedCounts = categoryCounts.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  return formattedCounts;
};

const getItemById = async (id) => {
  const item = await Item.findOne({ _id: id, isDeleted: false });
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, "No item found");

  const relatedItems = await Item.find({
    category: item.category,
    _id: { $ne: id },
    isDeleted: false
  })
    .sort({ createdAt: -1 })
    .limit(12);

  return { item, relatedItems };
};

const updateItemById = async (itemId, updateBody) => {
  const result = await getItemById(itemId);

  const item = result?.item;

  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }

  console.log("Actual item ===>", item);

  Object.assign(item, updateBody);
  await item.save();
  return item;
};

const deleteItemById = async (itemId) => {
  const item = await getItemById(itemId);
  if (item) {
    await Item.updateOne({ _id: itemId }, { isDeleted: true });
  }
  return item;
};

module.exports = {
  createItem,
  queryItems,
  getItemById,
  updateItemById,
  deleteItemById,
  getItemCountByCategory,
};
