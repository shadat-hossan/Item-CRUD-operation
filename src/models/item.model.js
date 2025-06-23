const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const itemSchema = new mongoose.Schema(
    {
        itemName: {
            type: String,
            trim: true,
            required: [true, "item name is required"],
        },
        brandName: {
            type: String,
            default: "",
            trim: true,
        },
        category: {
            type: String,
            trim: true,
            required: [true, "Category is required"],
            ref: "Categorie"
        },
        SKU: {
            type: String,
            unique: true,
            required: [true, "SKU is required"],
        },
        UPC: {
            type: String, 
            unique: true,
            required: [true, "UPC is required"],
        },
        stockQuantity: {
            type: Number,
            required: true,
            default: 0,
        },
        itemPrice: {
            type: Number,
            required: true,
            default: 1,
            min: [0, "item price must be non-negative"],
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, "Discount cannot be negative"],
            max: [100, "Discount cannot exceed 100%"],
        },
        itemColor: {
            type: [String],
            default: [],
        },
        itemSize: {
            type: [String],
            default: [],
        },
        itemImages: {
            type: [String],
            default: [],
            required: [true, "At least one item image is required"],
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        additionalInfo: {
            type: Map,
            of: String,
            default: {},
            require: false
        },
        mainImage: {
            type: String,
            required: [false, "Main image is optional"],
            default: "/uploads/items/def_item.png",
        },
        ratings: {
            type: Number,
            default: 0,
            min: [0, "Ratings cannot be negative"],
            max: [5, "Ratings cannot exceed 5"],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

itemSchema.plugin(toJSON);
itemSchema.plugin(paginate);


const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
