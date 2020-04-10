const Chainx = require('chainx.js').default;
var config = require('./config');
var _ = require('lodash');
let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let transfer_all
let processing = false;

(async () => {
  // 目前只支持 websocket 链接
  const chainx = new Chainx('wss://w1.chainx.org.cn/ws', {
    broadcast: ['wss://w1.chainx.org.cn/ws', 'https://w1.chainx.org.cn/rpc'],
  });

  // 等待异步的初始化
  await chainx.isRpcReady();

  //let cnt = 0
  //let size = _.size(config.accounts)

  console.log('node:', config.node)
  let loop = async function() {

    const nominationsRecords = await chainx.stake.getPseduNominationRecords(config.node)
    console.log('nominationsRecords:', nominationsRecords)

    // let i = 0
    // while (i < size) {
    //   let account = config.accounts[i]
      
    //   const bobAssets = await chainx.asset.getAssetsByAccount(account, 0, 10);
    //   let d = JSON.stringify(bobAssets);
    //   //console.log(new Date(), cnt, processing, ' bobAssets: ', d);

    //   cnt ++;
    //   var getPCX =  bobAssets.data.filter(function(item) {
    //     return item.name == 'PCX';
    //   });

    //   var getL_BTC =  bobAssets.data.filter(function(item) {
    //     return item.name == 'L-BTC';
    //   });

    //   let totalPCX = getPCX[0].details.Free + getPCX[0].details.ReservedStaking + getPCX[0].details.ReservedStakingRevocation;
    //   let total_L_BTC = getL_BTC[0].details.Free + getL_BTC[0].details.ReservedStaking + getL_BTC[0].details.ReservedStakingRevocation;
 
    //   console.log('account:', account, ': ', totalPCX/1e8, total_L_BTC/1e8)

    //   await sleep(1000)
    //   i++
    // }
  }

loop()

})();
