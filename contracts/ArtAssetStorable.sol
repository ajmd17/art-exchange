contract ArtAssetStorable {
    // Art asset object structure.
    struct ArtAsset {
        string contentHash;
        uint256 maxSupply;
        address creator;
    }
    
    mapping(string => ArtAsset) artAssetsById;

    function publishArtToken(string id, string _contentHash, uint256 _maxSupply, address _creator) public {
        require(artAssetsById[id].creator == address(0x0)); // not already found
        require(_maxSupply > 0);
        
        artAssetsById[id] = ArtAsset({
            contentHash: _contentHash,
            maxSupply: _maxSupply,
            creator: _creator
        });
    }
    
    function getArtToken(string id) public returns(string contentHash, uint256 maxSupply, address creator) {
        ArtAsset artAsset = artAssetsById[id];
        
        if (artAsset.creator == address(0x0)) throw; // not found
        
        contentHash = artAsset.contentHash;
        maxSupply = artAsset.maxSupply;
        creator = artAsset.creator;
    }
}