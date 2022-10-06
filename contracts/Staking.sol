pragma solidity ^0.8.1;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


contract Staking is ReentrancyGuard {
    IERC20 immutable tokenStake;
    IERC20 immutable tokenReward;
    address public immutable owner;
    uint8 public stakerCount;
    uint8 public initialRewardRate;
    uint256 public timeLock;
    uint256 public totalStake;
    uint256 public totalRewardPool;
    
    struct StakeInfo {
        uint256 amount;
        uint256 startTS;
        uint256 endTS;
        uint256 reward;
    }

    mapping(address => StakeInfo[]) stakeInfos;
    mapping(address => bool) isStaker;
    mapping(uint8 => address) stakeAddrs;


    constructor(IERC20 _tokenStake, IERC20 _tokenReward) public {
        owner = msg.sender;
        tokenStake = _tokenStake;
        tokenReward = _tokenReward;
        initialRewardRate = 20;
        timeLock = 360 * 24 * 60 * 60;
    }

    modifier onlyOwner() {
        if(msg.sender != owner) {
            revert();
        }
        _;
    }

    modifier onlyStaker() {
        if(!isStaker[msg.sender]) {
            revert();
        }
        _;
    }

    event Stake(
        address indexed from,
        uint256 amount
    );

    event Claim(
        address indexed from,
        uint256 amount
    );

    function stakeToken(uint256 _amount) external payable nonReentrant {
        require(_amount > 0, "_amount must be greater than 0");
        tokenStake.transferFrom(msg.sender, address(this), _amount);
        stakerCount++;
        totalStake += _amount;
        isStaker[msg.sender] = true;
        stakeAddrs[stakerCount] = msg.sender;
        stakeInfos[msg.sender].push(
            StakeInfo({
            amount: _amount,
            startTS: block.timestamp,
            endTS: block.timestamp + timeLock,
            reward: caculateRewardStake(_amount)
            // 31536000 means the total seconds per year
            })
        );
        emit Stake(msg.sender, _amount);
    }

    function claimToken() external payable onlyStaker nonReentrant {
        uint256 reward;
        for (uint256 _timeStake = 0; _timeStake < stakeInfos[msg.sender].length; _timeStake++) {
            if(stakeInfos[msg.sender][_timeStake].endTS < block.timestamp && stakeInfos[msg.sender][_timeStake].reward > 0) {
                reward += stakeInfos[msg.sender][_timeStake].reward;
                stakeInfos[msg.sender][_timeStake].reward = 0;
                SafeERC20.safeTransfer(tokenStake, msg.sender, stakeInfos[msg.sender][_timeStake].amount);
                totalStake -= stakeInfos[msg.sender][_timeStake].amount;
            }
        }
        require(reward > 0, "Not enough time to claim reward token");
        require(totalRewardPool >= reward, "Not enough reward token in pool to claim");
        SafeERC20.safeTransfer(tokenReward, msg.sender, reward);
        totalRewardPool -= reward;
        emit Claim(msg.sender, reward);
    }

    function addPoolRewardStake(uint256 _amount) external onlyOwner {
        tokenReward.transferFrom(msg.sender, address(this), _amount);
        totalRewardPool += _amount;
    }

    function caculateRewardStake(uint256 _amount) internal view returns(uint256) {
        uint256 _reward;        
        for (uint256 _month = 0; _month < 12; _month++) {
            _reward += _amount * (initialRewardRate - _month) * 30 / (100 * 360);
        }
        return _reward;
    }
}
