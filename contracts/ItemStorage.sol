// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ItemManager {
    struct Item {
        string name;
        uint256 price; // Price in wei
        string description;
        uint256 quantity; // Quantity of the item
        bool isActive; // Status of item (active or deleted)
    }

    mapping(uint256 => Item) private items;  // Store items by their ID
    uint256 private itemCount;                // Counter for the number of items

    event ItemAdded(uint256 indexed itemId, string name, uint256 price, string description, uint256 quantity);
    event ItemUpdated(uint256 indexed itemId, string name, uint256 price, string description, uint256 quantity);
    event ItemDeleted(uint256 indexed itemId);

    modifier validItemId(uint256 _itemId) {
        require(_itemId > 0 && _itemId <= itemCount, "Item does not exist");
        require(items[_itemId].isActive, "Item is deleted");
        _;
    }

    // Add a new item
    function addItem(string memory _name, uint256 _price, string memory _description, uint256 _quantity) public {
        require(_quantity > 0, "Quantity must be greater than zero");
        require(_price > 0, "Price must be greater than zero");
        
        itemCount++;
        items[itemCount] = Item(_name, _price, _description, _quantity, true);
        
        emit ItemAdded(itemCount, _name, _price, _description, _quantity);
    }

    // Update an existing item
    function updateItem(uint256 _itemId, string memory _name, uint256 _price, string memory _description, uint256 _quantity) 
        public validItemId(_itemId) 
    {
        require(_quantity > 0, "Quantity must be greater than zero");
        require(_price > 0, "Price must be greater than zero");

        items[_itemId] = Item(_name, _price, _description, _quantity, true);
        emit ItemUpdated(_itemId, _name, _price, _description, _quantity);
    }

    // Delete an existing item
    function deleteItem(uint256 _itemId) public validItemId(_itemId) {
        items[_itemId].isActive = false;
        emit ItemDeleted(_itemId);
    }

    // Get item details by ID
    function getItem(uint256 _itemId) public view validItemId(_itemId) returns (string memory name, uint256 price, string memory description, uint256 quantity) {
        Item memory item = items[_itemId];
        return (item.name, item.price, item.description, item.quantity);
    }

    // Get the total number of active items
    function getActiveItemCount() public view returns (uint256) {
        uint256 activeItemCount = 0;
        for (uint256 i = 1; i <= itemCount; i++) {
            if (items[i].isActive) {
                activeItemCount++;
            }
        }
        return activeItemCount;
    }
}
