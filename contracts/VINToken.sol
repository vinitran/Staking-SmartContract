pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VINToken is ERC20 {
    constructor() ERC20("Vin", "VIN") {
        _mint(msg.sender, 1000000000);
    }
}
