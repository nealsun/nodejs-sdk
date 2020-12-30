'use strict';

const ethers = require('ethers');

const {
    ServiceBase
} = require('../common/serviceBase');

const {
    getSignTx,
    getTxData
} = require('../common/web3lib/web3sync');

const MethodDecoder = require('../decoder').MethodDecoder;

const {
    BaasClient
} = require('./baasClient');

const BaasError = require('../common/exceptions').BaasError;

class BaasService extends ServiceBase {
    constructor(config) {
        super(config);
        this.baasClient = new BaasClient(config);
        this.contracts = {}
    }

    resetConfig(config) {
        super.resetConfig(config);
    }

    /*
    * {abi, name, version, groupId, address}
    */
    async getCnsCache(name, version) {
        let key = name + ':' + version;
        let cns = this.contracts[key]
        if (cns) {
            return cns;
        }
        let res = await this.getCNSInfo(name, version);
        if (res.data.code === 0) {
            this.contracts[key] = res.data.data;
            this.contracts[key].iface = new ethers.utils.Interface(res.data.data.abi);
            return this.contracts[key];
        } else {
            throw new BaasError('no cns found');
        }
    }

    async genTxRequest(name, version, methodSig, args, who = null) {
        let cns = await this.getCnsCache(name, version);
        let func = cns.iface.functions[methodSig];
        let blockHeightRes = await this.getMaxBlockNumber();
        if (blockHeightRes.data.code !== 0) {
            throw new BaasError('get block height error');
        }

        who = this._getWho(who);

        if (func.type === 'call') {
            let data = getTxData(func, args, this.config.encryptType);
            let callData = {
                from: this.config.accounts[who].account,
                to: cns.address,
                data
            }
            return {
                tx_type: 'get',
                tx_data: JSON.stringify(callData)
            }
        } else {
            let blockHeight = blockHeightRes.data.data
            let rawTransaction =  getSignTx(this.config, cns.address, func, args, blockHeight + 500, who);
            return {
                tx_type: 'set',
                tx_data: rawTransaction
            }
        }
    }

    async getContractTxResult(name, version, methodSig, args, who = null) {
        let request = await this.genTxRequest(name, version, methodSig, args, who);
        let response = await this.sendRaw(request);
        
        if (response.data.code !== 0) {
            throw new BaasError(`tx execute failed, ${response.data.message}`);
        } else {
            let cns = await this.getCnsCache(name, version);
            let func = cns.iface.functions[methodSig];
            let decoder = new MethodDecoder(func);
            let result = response.data.data.transactionReceipt;
            let status = result.status;
            let output = result.output;
            if (status !== "0x0") {
                let msg = null;
                try {
                    msg = decoder.decodeOutput(output);
                } catch(error) {}
                let errorInfo = "unexpected status: " + status;
                if (msg && msg.error) {
                    errorInfo += ", message: " + msg.error;
                }
                return new Error(errorInfo);
            }
            if (output !== "0x") {
                output = decoder.decodeOutput(output);
                return output.result;
            }
            return null;
        }
        
    }

    async getMaxBlockNumber() {
        let response = await this.baasClient.get({
            url: '/block_server/api/query/getMaxBlockNumberFromChain',
            method: 'get'
        })
        return response;
    }

    async getCNSInfo(name, version) {
        let response = await this.baasClient.get({
            url: '/block_server/api/query/getCNSInfo',
            method: 'get',
            params: {
                name,
                version
            }
        })
        return response;
    }

    async getOrgPublicKey(orgId) {
        let response = await this.baasClient.get({
            url: '/block_server/api/query/getOrgPublicKey',
            method: 'get',
            params: {
                orgId
            }
        })
        return response;
    }

    async getBlockByNumber(blockNumber, includeTransactions) {
        let response = await this.baasClient.get({
            url: '/block_server/api/query/getBlockByNumber',
            method: 'get',
            params: {
                blockNumber,
                includeTransactions: includeTransactions ? 'true' : 'false'
            }
        })
        return response;
    }

    async getTransactionByHash(hash, withProof) {
        let response = await this.baasClient.get({
            url: '/block_server/api/query/getTransactionByHash',
            method: 'get',
            params: {
                hash,
                withProof: withProof ? 'true' : 'false'
            }
        })
        return response;
    }

    async getReceiptByHash(hash) {
        let response = await this.baasClient.get({
            url: '/block_server/api/query/getReceiptByHash',
            method: 'get',
            params: {
                hash
            }
        })
        return response;
    }

    async sendRaw(data) {
        let response = await this.baasClient.post({
            url: '/block_server/api/chain/smartContract',
            method: 'post',
            data
        })
        return response;
    }

    _getWho(who) {
        if (!who) {
            who = Object.keys(this.config.accounts)[0];
        } else {
            if (!this.config.accounts[who]) {
                throw new Error(`invalid id of account: ${who}`);
            }
        }

        return who;
    }

}

module.exports.BaasService = BaasService;
