//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FantomCanvas is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    address payable public depositAddress = payable(0xFc3778f4b877B25A2A6B501a6Bd987bB6B43F7e0);

    //NFT
    string public baseExtension = ".json";
    string private _baseUrl;
    uint256 public maxMintable = 4800;
    Counters.Counter private _tokenIdCounter;
    uint256 public price = 1 ether;
    uint256 public paint_price = 1 ether;

    //State
    bool public pause = true;

    //Whitelist
    mapping(address => uint8) public freeMintAddress;

    //colors
    mapping(uint256 => uint8) public colors;

    constructor(string memory baseUrl) ERC721("FantomCanvas", "FC") {
        _baseUrl = baseUrl;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseUrl;
    }

    function mintPublic(uint256 id, uint8 color) public payable {
        //uint256 id = _tokenIdCounter.current();

        require(pause, "Contract Paused");
        require(msg.value == price, "Invalid amount");
        require(id < (maxMintable), "No more squares are available");        
        require(colors[id] == 0, "The square is already minted!");
        require(color > 0, "Color must be > 0!");

        // transfer amount to owner
        depositAddress.transfer(price);
        mint(msg.sender, id, color);
    }

    function mint(address to, uint256 id, uint8 color) internal {
        //uint256 id = _tokenIdCounter.current();
        require(id < maxMintable, "All squares have been minted!");
        require(colors[id] == 0, "The square is already minted!");

        _safeMint(to, id);
        colors[id] = color;
        _tokenIdCounter.increment();
    }    

    //Free mints (Fantom Chess community) 
    function addFreeMintAddresses(address[] memory _addresses) external onlyOwner {
        for (uint256 i = 0; i < _addresses.length; i++) {
            require(_addresses[i] != address(0), "Address cannot be 0.");
            require(freeMintAddress[_addresses[i]] == 0, "Balance must be 0.");
            freeMintAddress[_addresses[i]] = 5;
        }
    }
    
    function freeMint(uint256 id, uint8 color) public payable {
        require(pause, "Mint has not started yet.");
        require(freeMintAddress[msg.sender] > 0, "The address can no longer free mint");
        require(msg.value == price, "Invalid amount");
        require(colors[id] > 0, "The square is already minted!");
        require(color > 0, "Color must be > 0!");

        //Without transfer
        //depositAddress.transfer(price * amount);

        freeMintAddress[msg.sender] -= 1;
        mint(msg.sender, id, color);
    }
    
    //Paint functions 
    function paint(uint256 id, uint8 color) public payable {
        require(pause, "Contract Paused");
        require(msg.value == paint_price, "Invalid amount");
        require(id < (maxMintable), "No more squares are available");        
        require(colors[id] > 0, "Square not minted!");
        require(color > 0, "Color must be > 0!");

        //check if address own token
        require(ownerOf(id) == msg.sender, "You don't own this square");

        // transfer amount to owner
        depositAddress.transfer(paint_price);
        colors[id] = color;
    }

    //Setters - only owner
    function setPaintPrice(uint256 value) public onlyOwner {
        paint_price = value;
    }

    function setMaxMintable(uint256 value) public onlyOwner {
        maxMintable = value;
    }

    function setPause(bool _pause) public onlyOwner {
        pause = _pause;
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

    function getColor(uint256 id) external view returns (uint8) {
        return colors[id];
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