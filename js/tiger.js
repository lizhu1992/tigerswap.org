// note: USDT, USDC decimal = 6
var ethconnected = false;
var ethaddress = "0x";
var balance = 0;
var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/c7c5e46402114d019022afae15487355'));
var zooAddress = "0x500a7eAB8ae0fC36Bf586A8F5149d2885A3b40a3"; // zookeeper
var tokenAddress = "0xF6f70050F5104231810F185705BAEDFd7B577621"; // tigertoken

var currentPageToken = "0x";
var currentPagePoolID = 0;
var currentPageWalletBalance = 0;
var currentPageStaked = 0;
var currentPageReward = 0;
var usdcethpair = "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc";
var prices = {
    tigerusd: -1,
    tigereth: -1,
    ethusd: -1,
}
//contract,name,url,weight,yield
var pools = [
    ["0x83375310551BFB884482B18893008EB012bFd82B", "UNISWAP USDT/TIGER", "https://uniswap.info/pair/0x83375310551BFB884482B18893008EB012bFd82B", 10, 0, 0, "https://app.uniswap.org/#/add/0xdAC17F958D2ee523a2206206994597C13D831ec7/0xF6f70050F5104231810F185705BAEDFd7B577621"],
    ["0xB8C17Dc6da44146e8E88C194aBCcF62954070913", "UNISWAP USDC/TIGER", "https://uniswap.info/pair/0xB8C17Dc6da44146e8E88C194aBCcF62954070913", 5, 0, 0, "https://app.uniswap.org/#/add/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/0xF6f70050F5104231810F185705BAEDFd7B577621"],
    ["0x960A2B1Eb5bb0CA57fC3063ad2Fa2f9E34F1e36f", "UNISWAP ETH/TIGER", "https://uniswap.info/pair/0x960A2B1Eb5bb0CA57fC3063ad2Fa2f9E34F1e36f", 3, 0, 0, "https://app.uniswap.org/#/add/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/0xF6f70050F5104231810F185705BAEDFd7B577621"],
    ["0x66924650FAE20977cFcBDAbD9448de90aD360E71", "UNISWAP SUSHI/TIGER", "https://uniswap.info/pair/0x66924650FAE20977cFcBDAbD9448de90aD360E71", 1, 0, 0, "https://app.uniswap.org/#/add/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/0xF6f70050F5104231810F185705BAEDFd7B577621"],
    ["0xE8813bBd5a1bd197B666b485F4Cd0d55533E2C10", "UNISWAP KIMCHI/TIGER", "https://uniswap.info/pair/0xE8813bBd5a1bd197B666b485F4Cd0d55533E2C10", 1, 0, 0, "https://app.uniswap.org/#/add/0x1E18821E69B9FAA8e6e75DFFe54E7E25754beDa0/0xF6f70050F5104231810F185705BAEDFd7B577621"],
]
var loadedpools = 0;
var totalPoolWeight = 20;
var uniswapABI = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];
var erc20ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];
var zooABI = [{"inputs":[{"internalType":"contract TigerToken","name":"_tiger","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"BONUS_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"InitTigerPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"contract IERC20","name":"_lpToken","type":"address"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"bonusEndBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getCurrentHalvFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentRewardPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getHalvFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_from","type":"uint256"},{"internalType":"uint256","name":"_to","type":"uint256"}],"name":"getMultiplier","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getRewardPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"halvingPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"massUpdatePools","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"pendingTiger","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"contract IERC20","name":"lpToken","type":"address"},{"internalType":"uint256","name":"allocPoint","type":"uint256"},{"internalType":"uint256","name":"lastRewardBlock","type":"uint256"},{"internalType":"uint256","name":"accTigerPerShare","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tiger","outputs":[{"internalType":"contract TigerToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAllocPoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
var tokenABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];


function updateYield() {
  var zctx = new web3.eth.Contract(zooABI, zooAddress);
  zctx.methods.getCurrentRewardPerBlock().call( (e,r) => {
    var perblock = r;
    var annualblock = 365 * 86400 / 13; // approximation of 13 sec/block
    var annualreward = annualblock * perblock;
    var perpoolunit = annualreward / totalPoolWeight;

    var ctx0 = new web3.eth.Contract(uniswapABI,pools[0][0]);
    ctx0.methods.getReserves().call(function(err, result1) {
        ctx0.methods.totalSupply().call(function(err, result2) {
            ctx0.methods.balanceOf(zooAddress).call(function(err, result3) {
                var totalSupply=result2
                var stakedSupply=result3
                var percentageOfSupplyInPool=stakedSupply/totalSupply;
                pools[0][4]=(((perpoolunit/ (result1['_reserve0']*2/Math.pow(10,18)))*100*pools[0][3])/percentageOfSupplyInPool)
                pools[0][5]=(result1['_reserve0']*2/Math.pow(10,18)*percentageOfSupplyInPool)
                $('.pool0yield').animateNumbers(parseInt(pools[0][4])+'%')
                loadedPool()
            });
        });
    });

    var ctx1 = new web3.eth.Contract(uniswapABI,pools[0][0]);
    ctx1.methods.getReserves().call(function(err, result1) {
        ctx1.methods.totalSupply().call(function(err, result2) {
            ctx1.methods.balanceOf(zooAddress).call(function(err, result3) {
                var totalSupply=result2
                var stakedSupply=result3
                var percentageOfSupplyInPool=stakedSupply/totalSupply;
                pools[0][4]=(((perpoolunit/ (result1['_reserve0']*2/Math.pow(10,18)))*100*pools[0][3])/percentageOfSupplyInPool)
                pools[0][5]=(result1['_reserve0']*2/Math.pow(10,18)*percentageOfSupplyInPool)
                $('.pool1yield').animateNumbers(parseInt(pools[0][4])+'%')
                loadedPool()
            });
        });
    });

    var ctx2 = new web3.eth.Contract(uniswapABI,pools[2][0]);
    ctx2.methods.getReserves().call(function(err, result1) {
        ctx2.methods.totalSupply().call(function(err, result2) {
            ctx2.methods.balanceOf(zooAddress).call(function(err, result3) {
                var totalSupply=result2
                var stakedSupply=result3
                var percentageOfSupplyInPool=stakedSupply/totalSupply;
                pools[2][4]=(((perpoolunit/ (result1['_reserve0']*2/Math.pow(10,18)))*100*pools[2][3])/percentageOfSupplyInPool)
                pools[2][5]=(result1['_reserve0']*2/Math.pow(10,18)*percentageOfSupplyInPool)
                $('.pool2yield').animateNumbers(parseInt(pools[2][4])+'%')
                loadedPool()
            });
        });
    });

    var ctx3 = new web3.eth.Contract(uniswapABI,pools[3][0]);
    ctx3.methods.getReserves().call(function(err, result1) {
        ctx3.methods.totalSupply().call(function(err, result2) {
            ctx3.methods.balanceOf(zooAddress).call(function(err, result3) {
                var totalSupply=result2
                var stakedSupply=result3
                var percentageOfSupplyInPool=stakedSupply/totalSupply;
                pools[3][4]=(((perpoolunit/ (result1['_reserve1']*2/Math.pow(10,18)))*100*pools[3][3])/percentageOfSupplyInPool)
                pools[3][5]=(result1['_reserve1']*2/Math.pow(10,18)*percentageOfSupplyInPool)
                $('.pool3yield').animateNumbers(parseInt(pools[3][4])+'%')
                loadedPool()
            });
        });
    });

    var ctx4 = new web3.eth.Contract(uniswapABI,pools[4][0]);
    ctx4.methods.getReserves().call(function(err, result1) {
        ctx4.methods.totalSupply().call(function(err, result2) {
            ctx4.methods.balanceOf(zooAddress).call(function(err, result3) {
                var totalSupply=result2
                var stakedSupply=result3
                var percentageOfSupplyInPool=stakedSupply/totalSupply;
                pools[4][4]=(((perpoolunit/ (result1['_reserve1']*2/Math.pow(10,18)))*100*pools[4][3])/percentageOfSupplyInPool)
                pools[4][5]=(result1['_reserve1']*2/Math.pow(10,18)*percentageOfSupplyInPool)
                $('.pool4yield').animateNumbers(parseInt(pools[4][4])+'%')
                loadedPool()
            });
        });
    });
  });
}


async function connectWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        conn = await window.ethereum.enable();
        //console.log(conn.length)

        ethconnected = conn.length > 0
        if (ethconnected) {
            ethaddress = conn[0]
        }
        updateConnectStatus()
        web3.eth.getAccounts().then(console.log);

        return true;
    }
}

function updateConnectStatus() {
    if (ethconnected) {
        $('body').addClass('web3')
    }
    getBalance(ethaddress);

}

function getSupply() {
    var contract = new web3.eth.Contract(tokenABI, tokenAddress);
    contract.methods.totalSupply().call(function(error, result) {
        result = result / Math.pow(10, 18)
        //console.log(error, result)
        $('.supply span').animateNumbers(parseInt(result))
        $('.mcap span').animateNumbers(parseInt(result * prices['tigerusd']))
    });


}

function numberWithCommas(x) {
    var values = x.toString().split('.');
    return values[0].replace(/.(?=(?:.{3})+$)/g, '$&,') + ( values.length == 2 ? '.' + values[1] : '' )
}

function getBalance(address) {
    var contract = new web3.eth.Contract(tokenABI, tokenAddress);
    contract.methods.balanceOf(address).call(function(error, result) {
        contract.methods.decimals().call(function(error, d) {
            result = result / Math.pow(10, d);
            //console.log(error, result);

            $('.balance').text( numberWithCommas(result.toFixedSpecial(0)) + ' TIGER');
            balance = result;
        });
    });
}

function hidepages() {
    $('main').hide()
}

function nav(classname) {
    hidepages();
    $('body').removeClass('approved')
    $('main.' + classname).show()
    if (classname.indexOf('pool') === 0) {
        initpooldata(parseInt(classname.slice(-1)))
        $('main.pool').show()
    }
}

function initpooldata(id) {
    $('.farmname').text(pools[id][1] + ' pool')
    currentPageToken = pools[id][0]
    currentPagePoolID = id
    //get yield balance

    //get staked balance
    //if larger than zero, approved


    var contract = new web3.eth.Contract(zooABI, zooAddress);
    contract.methods.userInfo(currentPagePoolID, ethaddress).call(function(error, result) {
        currentPageStaked = result[0]
        result[0] = (result[0] / Math.pow(10, 18)).toFixedSpecial(7)
        //console.log(error, result)
        $('.stakedbalance').text(result[0])
    });


    var pagetoken = new web3.eth.Contract(erc20ABI, currentPageToken);
    pagetoken.methods.allowance(ethaddress, zooAddress).call(function(error, result) {
        if (result > 0) {
            $('body').addClass('approved')
        }
    });


    contract.methods.pendingTiger(currentPagePoolID, ethaddress).call(function(error, result) {

        currentPageReward = result
        result = (result / Math.pow(10, 18)).toFixedSpecial(3)
        //console.log(error, result)
        $('.rewardbalance').animateNumbers(result)

    });


    //get wallet balance


    var contract = new web3.eth.Contract(erc20ABI, currentPageToken);
    contract.methods.balanceOf(ethaddress).call(function(error, result) {
        contract.methods.decimals().call(function(error, d) {

            currentPageWalletBalance = result;
            result = (result / Math.pow(10, d)).toFixedSpecial(7);
            //console.log(error, result)
            $('.walletbalance').text(result)
        });
    });
}

function approveSpend() {
    var contract = new web3.eth.Contract(erc20ABI, currentPageToken);

    contract.methods.approve(zooAddress, "10000000000000000000000000000000000000000000000000000000").send({
            from: ethaddress
        },
        function(err, transactionHash) {
            //some code
            alert('Please wait until the approve transaction confirm to stake your pool token. You can refresh the page to update');


            var subscription = web3.eth.subscribe('pendingTransactions', function(error, result) {
                    if (!error)
                        addToPool();
                })
                .on("data", function(transaction) {
                    //console.log(transaction);
                });


            $('body').addClass('approved')
            console.log(transactionHash);
        });
}

function addToPool() {
    var contract = new web3.eth.Contract(zooABI, zooAddress);
    var amount = prompt('Amount to stake', (currentPageWalletBalance - 1000000) / Math.pow(10, 18)); // to fix round error due to JS

    contract.methods
        .deposit(currentPagePoolID, (amount * Math.pow(10, 18) - 100).toFixedSpecial(0))
        .send({
                from: ethaddress
            },
            function(err, transactionHash) {
                console.log(transactionHash);
            });
}

function claimReward() {
    var contract = new web3.eth.Contract(zooABI, zooAddress);
    contract.methods.deposit(currentPagePoolID, 0).send({
            from: ethaddress
        },
        function(err, transactionHash) {
            //some code
            //console.log(transactionHash)
        });
}

function removeFromPool() {
    var contract = new web3.eth.Contract(zooABI, zooAddress);
    var amount = prompt('Amount to withdraw', (currentPageStaked - 1000000) / 10 ** 18); // to fix round error due to JS
    contract.methods.withdraw(currentPagePoolID, (amount * Math.pow(10, 18)).toFixedSpecial(0)).send({
            from: ethaddress
        },
        function(err, transactionHash) {
            //some code
            //console.log(transactionHash)
        });
}

function getUniswapPrice() {
    var ctx0 = new web3.eth.Contract(uniswapABI, pools[2][0]); // tiger-eth
    var ctx1 = new web3.eth.Contract(uniswapABI, usdcethpair); // usdc-eth
    var ctx2 = new web3.eth.Contract(uniswapABI, pools[0][0]); // tiger-usdt
    try {
        ctx0.methods.getReserves().call(function(err, result1) {
            ctx1.methods.getReserves().call(function(err, result2) {
              ctx2.methods.getReserves().call(function(err, result3) {
                var tigereth = result1['_reserve1'] / result1['_reserve0'];
                prices['tigereth'] = tigereth;

                // eth/usd approximation by ETH-USDC pair
                var ethusd = result2['_reserve0'] / result2['_reserve1'] * Math.pow(10, 18 - 6); // cause USDC uses 6 decimal
                prices['ethusd'] = ethusd;

                var tigerusd = result3['_reserve0'] / result3['_reserve1'] * Math.pow(10, 18 - 6); // cause USDT uses 6 decimal
                prices['tigerusd'] = tigerusd;

                getSupply();
                updatePrice(prices['tigerusd']);
              });
            });
        });
    } catch (e) {
        console.error(e)
    }
}

function loadedPool() {
    loadedpools++;
    if (loadedpools > 3) {
        var tvl = 0;
        for (var i = 0; i < pools.length; i++) {
            //console.log(i,pools[i][5],pools[i][5])
            tvl = tvl + pools[i][5];

        }

        var realtvl = 0;
        for (var i = 0; i < pools.length; i++) {
            if (i != 2 && i != 3) {

                //console.log(i,pools[i][5],pools[i][5]);
                realtvl = realtvl + pools[i][5];
            }

        }
        //console.log(realtvl)
        $('.tvl span').animateNumbers(parseInt(tvl))
        console.warn('tvl:' + tvl)
    }
}

function updatePrice(p) {
    $('.tokenprice').text('$' + (p.toFixedSpecial(2)))
    updateYield();
}

function getlptoken(id) {
    if (typeof id === 'undefined') {
        window.open(pools[currentPagePoolID][6])
    } else {
        window.open(pools[id][6])
    }
}

function tradeLink(id) {
    if (typeof id === 'undefined') {
        window.open(pools[currentPagePoolID][2])
    } else {
        window.open(pools[id][2])
    }
}

function init() {
    connectWeb3()
}
init()
Number.prototype.toFixedSpecial = function(n) {
    var str = this.toFixed(n);
    if (str.indexOf('e+') === -1)
        return str;

    // if number is in scientific notation, pick (b)ase and (p)ower
    str = str.replace('.', '').split('e+').reduce(function(p, b) {
        return p + Array(b - p.length + 2).join(0);
    });

    if (n > 0)
        str += '.' + Array(n + 1).join(0);

    return str;
};
getUniswapPrice()

setInterval(function() {
    initpooldata(currentPagePoolID)
}, 30000)
