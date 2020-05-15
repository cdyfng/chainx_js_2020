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

  // let pairs = await chainx.trade.getTradingPairs();
  // console.log('trade:', pairs);


  // let id = 0; 
  // let piece = 10;
  // let quotations = await chainx.trade.getQuotations(id, piece);
  // console.log('Quotations: ', quotations);
  // let sell1_price = quotations.sell[0][0];
  // let buy1_price = quotations.buy[_.size(quotations.buy) -1 ][0];
  // console.log('order 0: ', sell1_price, buy1_price);
  // process.exit(1);

  //let who = '';
  // let page_index = 0;
  // let page_size = 10;
  // let orders = await chainx.trade.getOrders(who, page_index, page_size);
  // console.log('orders: ', orders);


  // 取消订单
  // let pair_index = 0;
  // let order_index = 8;
  // let cancel_order = chainx.trade.cancelOrder(pair_index, order_index)
  // //签名并发送交易，0x0000000000000000000000000000000000000000000000000000000000000000 是用于签名的私钥
  // let pri_key = config.account_key;


  //下单
  let pair_index = 0
  let order_type = 'Limit'
  let order_direction = 'Buy'
  let amount = 110000000
  let price = 140002

  let create_order = chainx.trade.putOrder(pair_index, order_type, order_direction, amount, price)
  let pri_key = config.account_key;
  console.log('key:', pri_key)

  await create_order.signAndSend(pri_key, (error, response) => {
    if (error) {
      console.log(error);
    } else if (response.status === 'Finalized') {
      if (response.result === 'ExtrinsicSuccess') {
        console.log('交易成功');
      }
    }
  });

})();
