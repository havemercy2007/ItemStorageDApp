const ItemManager = artifacts.require("ItemManager");

contract("ItemManager", (accounts) => {
    let instance;

    before(async () => {
        instance = await ItemManager.deployed();
    });

    it("should add an item", async () => {
        await instance.addItem("Test Item", web3.utils.toWei("0.1", "ether"), "Test Description", 10, { from: accounts[0] });
        const item = await instance.getItem(1);
        assert.equal(item[0], "Test Item");
        assert.equal(item[1].toString(), web3.utils.toWei("0.1", "ether"));
        assert.equal(item[2], "Test Description");
        assert.equal(item[3].toString(), "10");
    });

    // Add more tests as needed
});
