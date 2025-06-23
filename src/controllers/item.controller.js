const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const response = require("../config/response");
const { itemService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const unlinkImages = require("../common/unlinkImage");

const generateRandomCode = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

const parseToArray = (data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch {
            return [data];
        }
    }
    return [data];
};

const createItem = catchAsync(async (req, res) => {
    req.body.SKU = generateRandomCode(8);
    req.body.UPC = generateRandomCode(12);

    req.body.itemColor = parseToArray(req.body.itemColor);
    req.body.itemSize = parseToArray(req.body.itemSize);

    if (req.files && req.files.itemImages) {
        req.body.itemImages = req.files.itemImages.map(file => "/uploads/items/" + file.filename);
    } else {
        req.body.itemImages = parseToArray(req.body.itemImages).map(img => "/uploads/items/" + img);
    }
    if (req.body.additionalInfo && typeof req.body.additionalInfo === 'string') {
        try {
            req.body.additionalInfo = JSON.parse(req.body.additionalInfo);
        } catch (error) {
            return res.status(400).json({
                message: 'Invalid JSON format for additionalInfo.',
                error: error.message,
            });
        }
    }

    const item = await itemService.createItem(req.body);
    res.status(httpStatus.CREATED).json(
        response({
            message: "Item Created",
            status: "OK",
            statusCode: httpStatus.CREATED,
            data: item,
        })
    );
});


const getItems = catchAsync(async (req, res) => {
    const filter = pick(req.query, ["itemName", "brandName", "category", "SKU", "UPC", "itemPrice", "itemSize", "type"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = await itemService.queryItems(filter, options);
    res.status(httpStatus.OK).json(
        response({
            message: "All Items",
            status: "OK",
            statusCode: httpStatus.OK,
            data: result,
            pagination: {
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                totalItems: result.totalItems,
            },
        })
    );
});

const getItemById = catchAsync(async (req, res) => {
    const item = await itemService.getItemById(req.params.itemId);
    res.status(httpStatus.OK).json(
        response({
            message: "Item Found",
            status: "OK",
            statusCode: httpStatus.OK,
            data: item,
        })
    );
});

const updateItem = catchAsync(async (req, res) => {
    req.body.itemColor = parseToArray(req.body.itemColor);
    req.body.itemSize = parseToArray(req.body.itemSize);

    if (req.files && req.files.itemImages) {
        req.body.itemImages = req.files.itemImages.map(file => "/uploads/items/" + file.filename);
    } else if (req.body.itemImages) {
        req.body.itemImages = parseToArray(req.body.itemImages).map(img => "/uploads/items/" + img);
    }
    if (req.body.additionalInfo && typeof req.body.additionalInfo === 'string') {
        try {
            req.body.additionalInfo = JSON.parse(req.body.additionalInfo);
        } catch (error) {
            return res.status(400).json({
                message: 'Invalid JSON format for additionalInfo.',
                error: error.message,
            });
        }
    }

    const item = await itemService.updateItemById(req.params.itemId, req.body);
    res.status(httpStatus.OK).json(
        response({
            message: "Item Updated",
            status: "OK",
            statusCode: httpStatus.OK,
            data: item,
        })
    );
});

const deleteItem = catchAsync(async (req, res) => {
    await itemService.deleteItemById(req.params.itemId);
    res.status(httpStatus.OK).json(
        response({
            message: "Item Deleted",
            status: "OK",
            statusCode: httpStatus.OK,
            data: null,
        })
    );
});

module.exports = {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem,
};
