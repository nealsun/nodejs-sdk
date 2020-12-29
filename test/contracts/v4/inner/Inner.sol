pragma solidity ^0.4.23;
import "Outer.sol";
import "inner/Same.sol";

contract Inner is Outer {
    string name;
    int value;

    constructor() public {
        name = "Hello, World!";
    }

    function getName() public view returns (string) {
        return name;
    }

    function getValue() public view returns (int) {
        return value;
    }

    function set(string n) public {
        name = n;
    }

    function set(int n) public {
        value = n;
    }
}
