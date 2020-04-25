const Chainx = require("chainx.js").default;
var config = require("./config");
var _ = require("lodash");
let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let transfer_all;
let processing = false;

(async () => {
  // 目前只支持 websocket 链接
  const chainx = new Chainx("wss://w1.chainx.org.cn/ws", {
    broadcast: ["wss://w1.chainx.org.cn/ws", "https://w1.chainx.org.cn/rpc"]
  });

  // 等待异步的初始化
  await chainx.isRpcReady();

  let cnt = 0;
  let size = _.size(config.accounts);
  let total_pcx = (total_xbtc = 0);

  console.log("accounts:", config.accounts);
  let loop = async function() {
    let i = 0;
    while (i < size) {
      let account = config.accounts[i];

      const bobAssets = await chainx.asset.getAssetsByAccount(account, 0, 10);
      let d = JSON.stringify(bobAssets);
      //console.log(new Date(), cnt, processing, ' bobAssets: ', d);

      cnt++;
      var getPCX = bobAssets.data.filter(function(item) {
        return item.name == "PCX";
      });

      var getL_BTC = bobAssets.data.filter(function(item) {
        return item.name == "L-BTC";
      });

      var getX_BTC = bobAssets.data.filter(function(item) {
        return item.name == "BTC";
      });

      function sum_xbtc() {
        let btc = 0;
        try {
          btc =
            getX_BTC[0].details.Free +
            getX_BTC[0].details.ReservedStaking +
            getX_BTC[0].details.ReservedStakingRevocation;
        } catch {
          //console.log('error getX_BTC');
        }
        return btc;
      }

      var total_X_BTC = sum_xbtc();

      let totalPCX =
        getPCX[0].details.Free +
        getPCX[0].details.ReservedStaking +
        getPCX[0].details.ReservedStakingRevocation;
      let total_L_BTC =
        getL_BTC[0].details.Free +
        getL_BTC[0].details.ReservedStaking +
        getL_BTC[0].details.ReservedStakingRevocation;

      console.log(
        "account:",
        account,
        ": ",
        totalPCX / 1e8,
        total_L_BTC / 1e8,
        total_X_BTC / 1e8
      );
      total_pcx += totalPCX / 1e8;
      total_xbtc += total_X_BTC / 1e8;

      await sleep(1000);
      i++;
    }

    console.log("total PCX:", total_pcx, ",total XBTC:", total_xbtc);
    process.exit(1);
  };

  loop();
})();
