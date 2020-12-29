pragma solidity ^0.5.1;
import "Outer.sol";
import "inner/Same.sol";

contract Inner is Outer {
    string name;

    mapping(int => mapping(int => int)) public param;

    constructor() public {
        name = "Hello, World!";
    }

    function setMap(int a, int b, int c) public {
        param[a][b] = c;
    }

    function get() public view returns (string memory) {
        return name;
    }

    function set(string memory n) public {
        name = n;
    }
}
