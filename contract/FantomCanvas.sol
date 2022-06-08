//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BadBalloons is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    address payable public depositAddress = payable(0xFc3778f4b877B25A2A6B501a6Bd987bB6B43F7e0);

    //NFT
    string public baseExtension = ".json";
    string private _baseUrl;
    uint256 public maxMintable = 10000;
    Counters.Counter private _tokenIdCounter;
    uint256 public price = 1 ether;
    uint256 public change_color_fee = 0.1 ether;

    //State
    bool public pause_public_mint = true;
    bool public pause_whitelist_mint = true;

    //Whitelist
    mapping(address => uint8) public whitelistedAddress;

    constructor(string memory baseUrl) ERC721("BadBalloons", "BB") {
        _baseUrl = baseUrl;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseUrl;
    }

    function mint_public(uint256 amount) public payable {
        uint256 id = _tokenIdCounter.current();

        require(!pause_public_mint, "Contract Paused");
        require(msg.value == price * amount, "Invalid amount");
        require(id < (maxMintable), "No more balloons are available");

        // transfer amount to owner
        depositAddress.transfer(price * amount);

        for (uint256 i = 0; i < amount; i++) {
            mint(msg.sender);
        }        
    }

    function mint(address to) internal {
        require(_tokenIdCounter.current() < maxMintable, "All balloons have been minted!");
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }    

    //Whitelist
    function addWhitelistAddresses(address[] memory _addresses) external onlyOwner {
        for (uint256 i = 0; i < _addresses.length; i++) {
            require(_addresses[i] != address(0), "Address cannot be 0.");
            require(whitelistedAddress[_addresses[i]] == 0, "Balance must be 0.");
            whitelistedAddress[_addresses[i]] = 10;
        }
    }
    
    function mint_whitelist(uint8 amount) public payable {
        require(!pause_whitelist_mint, "Pre-sale has not started yet.");
        require(whitelistedAddress[msg.sender] > 0, "The address can no longer pre-order");
        require(amount <= whitelistedAddress[msg.sender], "All mints of the address are over");
        require(msg.value == price * amount, "Invalid amount");

        depositAddress.transfer(price * amount);

        whitelistedAddress[msg.sender] -= amount;
        for (uint8 i = 0; i < amount; i++) {
            mint(msg.sender);
        }
    }

    //Setters - only owner
    function setMaxMintable(uint256 value) public onlyOwner {
        maxMintable = value;
    }

    function set_pause_public_mint(bool _pause) public onlyOwner {
        pause_public_mint = _pause;
    }

    function set_pause_whitelist_mint(bool _pause) public onlyOwner {
        pause_whitelist_mint = _pause;
    }

    function setTokenURI(uint256 tokenId, string memory newURI) public onlyOwner {
        _setTokenURI(tokenId, newURI);
    }
    
    function setBaseURL(string memory newBase) public onlyOwner {
        _baseUrl = newBase;
    }
    
    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
        baseExtension = _newBaseExtension;
    }
    
    function setDepositAddress(address payable to) public onlyOwner {
        depositAddress = to;
    }

    function setPrice(uint256 value) public onlyOwner {
        price = value;
    }
    
    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(
          _exists(tokenId),
          "ERC721Metadata: URI query for nonexistent token"
        );
    
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
            : "";
    }

    function itemsOwned(address _owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);
        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 index;

            for (index = 0; index < tokenCount; index++) {
                result[index] = tokenOfOwnerByIndex(_owner, index);
            }

            return result;
        }
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}