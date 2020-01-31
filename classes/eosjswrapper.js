const { JsonRpc, Api, Serialize } = require("eosjs");
const fetch = require('node-fetch')
const { TextEncoder, TextDecoder } = require('util');

const rpc = new JsonRpc("https://jungle.eosdac.io", { fetch }); //api.main.alohaeos.com, eos.greymass.com, jungle2.cryptolions.io jungle.eosdac.io
const api = new Api({
  rpc,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder()
});

class eosWrapper {
  constructor(api) {
      console.log("eos api initialized.")
    this.nodes = ["https://jungle.eosdac.io"];
    this.api = api;
  }

  async getGroupMeta(groupname) {
    try {
      let res = await this.api.rpc.get_table_rows({
        json: true,
        code: "eosgroups222",
        scope: "eosgroups222",
        lower_bound: groupname,
        upper_bound: groupname,
        table: "groups",
        limit: 1
      });
      if (res && res.rows[0] && res.rows[0].groupname == groupname) {
        res = res.rows[0];

        if(res.ui.logo != "" && res.ui.logo.startsWith('./') ){
            res.ui.logo = "https://daclify.com"+res.ui.logo.substring(1);
        }
        else if(res.ui.logo == "" || !res.ui.logo.startsWith('https://') ){
            res.ui.logo = "";
        }
        return res;
      }
    }
    catch (e) {
      console.log(e);
      return false;
    }
  }


}

const eosapi = new eosWrapper(api);

module.exports = eosapi;
