import "./Token.sol";

contract AssetToken is Token {
    mapping(address => mapping(string => uint256)) artAssetBalances; // map from address to map of id => balance.
    mapping(address => mapping(string => uint256)) lockedArtAssetBalances;
}