pragma solidity ^0.4.23;
import "Outer.sol";
import "inner/Same.sol";

contract Inner is Outer {
    string name;
    int value;

    mapping(int => mapping(int => int)) public param;

    constructor() public {
        name = "Hello, World!";
    }

    function setMap(int a, int b, int c) public {
        param[a][b] = c;
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

    function set(string n, int v) public {
        name = n;
        value = v;
    }
}
