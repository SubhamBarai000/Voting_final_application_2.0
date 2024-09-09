const { ethers } = require("hardhat");

async function main() {
    // Deploy contract
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Compile the contract
    const Voting = await ethers.getContractFactory("Voting");

    // Set candidate names and voting duration
    const candidateNames = ["STQC", "ERTL", "CC"];
    const durationInMinutes = 60;
    // Deploy the contract
    const voting = await Voting.deploy(candidateNames, durationInMinutes);
    console.log("Voting contract deployed to:", voting.address);

    // Wait for the deployment to be mined
    await voting.deployed();

    // Verify the contract on PolygonScan (optional)
    // await hre.run("verify:verify", {
    //   address: voting.address,
    //   constructorArguments: [candidateNames, durationInMinutes]
    // });

    console.log("Deployment complete.");
}

// Handle errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});