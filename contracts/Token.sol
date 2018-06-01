contract Token {
    mapping(address => uint) balances;
    mapping(address => uint) lockedBalances;
    mapping(address => mapping(address => uint)) allowed;
}