const Web3 = require('web3');
let web3;
let contract;

const init = async () => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ItemManager.networks[networkId];
        contract = new web3.eth.Contract(
            ItemManager.abi,
            deployedNetwork.address
        );
        listenForEvents();
    } else {
        console.error("Ethereum browser extension not detected.");
    }
};

const listenForEvents = () => {
    contract.events.ItemAdded({}, (error, event) => {
        if (error) console.error(error);
        console.log("Item added:", event.returnValues);
        // Update UI accordingly
    });

    contract.events.ItemUpdated({}, (error, event) => {
        if (error) console.error(error);
        console.log("Item updated:", event.returnValues);
        // Update UI accordingly
    });
};

document.getElementById("itemForm").onsubmit = async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const quantity = document.getElementById("quantity").value;
    const accounts = await web3.eth.getAccounts();
    await contract.methods.addItem(name, price, description, quantity).send({ from: accounts[0] });
};

window.addEventListener('load', init);
