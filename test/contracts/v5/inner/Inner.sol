pragma solidity ^0.5.1;
import "Outer.sol";
import "inner/Same.sol";

contract Inner is Outer {
    string name;

    constructor() public {
        name = "Hello, World!";
    }

    function get() public view returns (string memory) {
        return name;
    }

    function set(string memory n) public {
        name = n;
    }
}
