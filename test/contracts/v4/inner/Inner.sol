pragma solidity ^0.4.23;
import "Outer.sol";
import "inner/Same.sol";

contract Inner is Outer {
    string name;

    constructor() public {
        name = "Hello, World!";
    }

    function get() public view returns (string) {
        return name;
    }

    function set(string n) public {
        name = n;
    }
}
