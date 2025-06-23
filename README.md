# Item CRUD API Documentation

This is a simple **Item CRUD** (Create, Read, Update, Delete) API for managing items with various operations, including uploading images, handling item details, and performing basic operations like querying, creating, updating, and deleting items. The API is designed to be easy to use and integrate with other services or applications.

---

## Server Address

The backend server is already deployed and accessible at:

**Server URL**: [https://itemcrud8088.sobhoy.com](https://itemcrud8088.sobhoy.com)

## Postman Collection

You can import the Postman collection to test the API endpoints directly. The collection includes all the requests, headers, and example responses:

[Postman Collection Link](https://www.postman.com/medical-product/workspace/rest-api-s-just-for-item-crud/request/39875957-9a89b621-51cf-4ca8-8f48-332f634408c8?action=share&creator=39875957&ctx=documentation)

## API Setup Instructions

### 1. Clone the Repository

To get started, clone the repository from GitHub:

```bash
git clone https://github.com/shadat-hossan/Item-CRUD-operation.git
```

### 2. Install Dependencies

```bash
cd Item-CRUD-operation
npm install
```

### 3. Setup Environment Variables

You don’t need to set up the database as it is already configured. However, you will need to configure the .env file for backend settings.

1. Open the .env file in the root directory.

2. Change the BACKEND_IP to your local machine's IP address.

```
BACKEND_IP=your_local_ip_address
```

### 4. Start the Server

Once you have installed the dependencies and updated the environment variables, you can start the server:

```
npm run dev
```
Your backend server should now be running and accessible at http://your_IP:8088. or http://localhost:8088.

## API Endpoints

Below are the available API routes for the Item CRUD operations:

### 1. Create Item (POST /create)

Create a new item. You can upload images, specify item details, and add extra information.

Required Fields:

- itemName

- SKU

- UPC

- itemPrice

- itemImages

- category


### 2. Create Item (POST /create-live-item)

Create a live item with similar fields as the regular item, but for live-streaming purposes.

### 3. Get All Items (GET /all)

Retrieve all items based on query parameters like filtering by category, SKU, price, etc.

### 4. Get Item by ID (GET /:itemId)

Retrieve an item by its ID.

### 5. Update Item (PATCH /:itemId)

Update an existing item by its ID. You can update fields like item name, price, images, and additional info.

### 6. Delete Item (DELETE /:itemId)

Delete an item by its ID. This will mark the item as deleted (soft delete).

## API Request Example (Create Item)

# POST /create
```
{
  "itemName": "Item Name",
  "itemPrice": 100,
  "itemColor": ["Red", "Blue"],
  "itemSize": ["M", "L"],
  "itemImages": ["/uploads/items/image1.jpg", "/uploads/items/image2.jpg"],
  "category": "Electronics",
  "additionalInfo": "{\"info\": \"Extra details about the item\"}"
}
```
