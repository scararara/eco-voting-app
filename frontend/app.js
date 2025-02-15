const contractAddress = "0xD7ddAd595Ae7C751ca95F84E6b8a2b72f4874a6f"; 
const contractABI = [
    {
        "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
        "name": "getProject",
        "outputs": [
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;

// Initialize Web3
async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        contract = new web3.eth.Contract(contractABI, contractAddress);
        updateVotes();

        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts) => {
            console.log("Account changed:", accounts[0]);
            updateVotes();
        });
    } else {
        alert("Please install MetaMask!");
    }
}

// Vote Function
async function vote(projectIndex) {
    const accounts = await web3.eth.getAccounts();
    console.log("Voting for project:", projectIndex, "from:", accounts[0]);

    const tx = await contract.methods.vote(projectIndex).send({ from: accounts[0] });
    console.log("Transaction Hash:", tx.transactionHash);

    // Delay before fetching updated votes
    setTimeout(updateVotes, 5000);
}

// Update Vote Counts
async function updateVotes() {
    console.log("Updating votes...");
    for (let i = 0; i < 3; i++) {
        try {
            const project = await contract.methods.getProject(i).call();
            console.log(`Project ${i}: Name = ${project[0]}, Votes = ${project[1]}`);
            document.getElementById(`votes-${i}`).innerText = project[1];
        } catch (error) {
            console.error(`Error fetching votes for project ${i}:`, error);
        }
    }
}




// Initialize Web3 on Page Load
window.onload = initWeb3;
