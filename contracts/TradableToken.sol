import "./SafeMath.sol";
import "./AssetToken.sol";

contract TradableToken is AssetToken {
    using SafeMath for uint;

    function lockBalance(address owner, uint amount) private {
        require(balances[owner] >= amount);
        balances[owner] = balances[owner].sub(amount);
        lockedBalances[owner] = lockedBalances[owner].add(amount);
    }

    function unlockBalance(address owner, uint amount) private {
        require(lockedBalances[owner] >= amount);
        lockedBalances[owner] = lockedBalances[owner].sub(amount);
        balances[owner] = balances[owner].add(amount);
    }

    function lockAssetBalance(address owner, string assetId, uint amount) private {
        require(artAssetBalances[owner][assetId] >= amount);
        artAssetBalances[owner][assetId] = artAssetBalances[owner][assetId].sub(amount);
        lockedArtAssetBalances[owner][assetId] = lockedArtAssetBalances[owner][assetId].add(amount);
    }

    function unlockAssetBalance(address owner, string assetId, uint amount) private {
        require(lockedArtAssetBalances[owner][assetId] >= amount);
        lockedArtAssetBalances[owner][assetId] = lockedArtAssetBalances[owner][assetId].sub(amount);
        artAssetBalances[owner][assetId] = artAssetBalances[owner][assetId].add(amount);
    }

    function increaseBalance(address owner, uint amount) private {
        balances[owner] = balances[owner].add(amount);
    }

    function increaseLockedBalance(address owner, uint amount) private {
        lockedBalances[owner] = lockedBalances[owner].add(amount);
    }

    function increaseAssetBalance(address owner, string assetId, uint amount) private {
        artAssetBalances[owner][assetId] = artAssetBalances[owner][assetId].add(amount);
    }

    function increaseLockedAssetBalance(address owner, string assetId, uint amount) private {
        lockedArtAssetBalances[owner][assetId] = lockedArtAssetBalances[owner][assetId].add(amount);
    }

    function burnBalance(address owner, uint amount) private {
        require(balances[owner] >= amount);
        balances[owner] = balances[owner].sub(amount);
    }

    function burnLockedBalance(address owner, uint amount) private {
        require(lockedBalances[owner] >= amount);
        lockedBalances[owner] = lockedBalances[owner].sub(amount);
    }

    function burnAssetBalance(address owner, string assetId, uint amount) private {
        require(artAssetBalances[owner][assetId] >= amount);
        artAssetBalances[owner][assetId] = artAssetBalances[owner][assetId].sub(amount);
    }

    function burnLockedAssetBalance(address owner, string assetId, uint amount) private {
        require(lockedArtAssetBalances[owner][assetId] >= amount);
        lockedArtAssetBalances[owner][assetId] = lockedArtAssetBalances[owner][assetId].sub(amount);
    }
    
    struct Order {
        uint256 price;
        uint256 qty;
        uint256 qtyFilled;
        address poster;
    }

    // maps from art asset ID to a mapping from price => order queue
    mapping(string => mapping(uint256 => Order[])) postedBids;
    mapping(string => mapping(uint256 => Order[])) postedAsks;

    // returns the unfilled qty (useful in case of non post-only - creates market order)
    function postBid(string _assetId, uint256 _price, uint256 _qty, bool postOnly) public returns (uint256) {
        address sender = msg.sender;
        
        uint256 qty = _qty;
        uint256 tokenQty = _price.mul(qty);
        require(balances[sender] >= tokenQty);
        
        if (postedAsks[_assetId][_price].length != 0) {
            if (postOnly) throw;

            qty = marketBuy(_assetId, _price, qty);
        }

        if (qty != 0) {
            // lock away the tokens
            lockBalance(sender, tokenQty);
    
            postedBids[_assetId][_price].push(Order({
                price: _price,
                qty: qty,
                qtyFilled: 0,
                poster: sender
            }));
        }

        return qty;
    }
    
    function postAsk(string _assetId, uint256 _price, uint256 _qty, bool postOnly) public returns (uint256) {
        address sender = msg.sender;
        uint256 qty = _qty;

        require(artAssetBalances[sender][_assetId] >= qty);


        if (postedBids[_assetId][_price].length != 0) {
            if (postOnly) throw;

            qty = marketSell(_assetId, _price, qty);
        }

        if (qty != 0) {
            lockAssetBalance(sender, _assetId, qty);
    
            postedAsks[_assetId][_price].push(Order({
                price: _price,
                qty: qty,
                qtyFilled: 0,
                poster: sender
            }));
        }

        return qty;
    }
    
    function marketBuy(string _assetId, uint256 _price, uint256 _qty) public returns (uint256) {
        address sender = msg.sender;
        uint256 balance = balances[sender];
        uint256 tokenQty = _price.mul(_qty);
        require(balance >= tokenQty);

        uint256 unfilled = _qty;

        for (uint i = 0; i < postedAsks[_assetId][_price].length; i++) {
            if (unfilled == 0) {
                break;
            }

            uint256 askQty = postedAsks[_assetId][_price][i].qty;
            address askPoster = postedAsks[_assetId][_price][i].poster;
            
            if (askPoster == sender) {
                continue; // do not allow buying from / selling to self
            }
            
            // make sure the bid poster has the available funds!
            assert(lockedArtAssetBalances[askPoster][_assetId] >= askQty);

            if (askQty >= unfilled) {
                postedAsks[_assetId][_price][i].qty = postedAsks[_assetId][_price][i].qty.sub(unfilled);
                postedAsks[_assetId][_price][i].qtyFilled = postedAsks[_assetId][_price][i].qtyFilled.add(unfilled);

                // transfer sender's asset balance to bidPoster
                burnLockedAssetBalance(askPoster, _assetId, unfilled);
                increaseAssetBalance(sender, _assetId, unfilled);

                // transfer the locked tokens from the bid poster to the market seller.
                increaseBalance(askPoster, _price.mul(unfilled));
                burnBalance(sender, _price.mul(unfilled));

                unfilled = 0;
            } else {
                postedAsks[_assetId][_price][i].qty = 0;
                postedAsks[_assetId][_price][i].qtyFilled = postedAsks[_assetId][_price][i].qtyFilled.add(askQty);

                // transfer the art asset from the market seller to the bid poster.
                burnLockedAssetBalance(askPoster, _assetId, askQty);
                increaseAssetBalance(sender, _assetId, askQty);

                // transfer the locked tokens from the bid poster to the market seller.
                increaseBalance(askPoster, _price.mul(_price.mul(askQty)));
                burnBalance(sender, _price.mul(_price.mul(askQty)));

                unfilled = unfilled.sub(askQty);
            }
        }

        cleanAsks(_assetId, _price);

        return unfilled;
    }
    
    // @TODO: fees implementation.
    // 1. market-buying asset using tokens:
    //   seller receives all tokens minus 0.2% fee. 0.1% goes to the platform and 0.1% goes to the original creator.
    // 2. limit-buying asset using tokens:
    //   receive entire asset with no fee, in fact, a 0.1% rebate is given, as the seller pays a 0.3% fee (see below)
    // 3. market-selling asset for tokens:
    //   you, the seller, receive all tokens minus 0.3% fee. 0.1% -> platform, 0.1% -> OC, 0.1% -> market-maker.
    // 4. limit-selling asset for tokens:
    //   you, the seller, sell the whole asset for the tokens minus a 0.2% fee (see first)
    function marketSell(string _assetId, uint256 _price, uint256 _qty) public returns (uint256) { // returns amount that could not be filled
        address sender = msg.sender;
        uint256 artAssetBalance = artAssetBalances[sender][_assetId];
        require(artAssetBalance >= _qty);

        uint256 unfilled = _qty;

        for (uint i = 0; i < postedBids[_assetId][_price].length; i++) {
            if (unfilled == 0) {
                break;
            }

            uint256 bidQty = postedBids[_assetId][_price][i].qty;
            address bidPoster = postedBids[_assetId][_price][i].poster;
            
            if (bidPoster == sender) {
                continue; // do not allow buying from / selling to self
            }
            
            // make sure the bid poster has the available funds!
            assert(lockedBalances[bidPoster] >= _price.mul(bidQty));

            if (bidQty >= unfilled) {
                postedBids[_assetId][_price][i].qty = postedBids[_assetId][_price][i].qty.sub(unfilled);
                postedBids[_assetId][_price][i].qtyFilled = postedBids[_assetId][_price][i].qtyFilled.add(unfilled);

                // transfer sender's asset balance to bidPoster
                burnAssetBalance(sender, _assetId, unfilled);
                increaseAssetBalance(bidPoster, _assetId, unfilled);

                // transfer the locked tokens from the bid poster to the market seller.
                burnLockedBalance(bidPoster, _price.mul(unfilled));
                increaseBalance(sender, _price.mul(unfilled));

                unfilled = 0;
            } else {
                postedBids[_assetId][_price][i].qty = 0;
                postedBids[_assetId][_price][i].qtyFilled = postedBids[_assetId][_price][i].qtyFilled.add(bidQty);

                // transfer the art asset from the market seller to the bid poster.
                burnAssetBalance(sender, _assetId, bidQty);
                increaseAssetBalance(bidPoster, _assetId, bidQty);

                // transfer the locked tokens from the bid poster to the market seller.
                burnLockedBalance(bidPoster, _price.mul(_price.mul(bidQty)));
                increaseBalance(sender, _price.mul(_price.mul(bidQty)));

                unfilled = unfilled.sub(bidQty);
            }
        }

        cleanBids(_assetId, _price);

        return unfilled;
    }

    function cleanBids(string _assetId, uint256 _price) private {
        for (uint i = 0; i < postedBids[_assetId][_price].length; i++) {
            if (postedBids[_assetId][_price][i].qty == 0) {
                delete postedBids[_assetId][_price][i];
            }
        }
    }

    function cleanAsks(string _assetId, uint256 _price) private {
        for (uint i = 0; i < postedAsks[_assetId][_price].length; i++) {
            if (postedAsks[_assetId][_price][i].qty == 0) {
                delete postedAsks[_assetId][_price][i];
            }
        }
    }
}