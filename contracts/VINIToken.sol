pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VINIToken is ERC20 {
    constructor() ERC20("Vini", "VINI") {
        _mint(msg.sender, 1000000);
    }
}
