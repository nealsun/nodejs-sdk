'use strict';

const path = require('path');
const should = require('should');
const { Configuration, Web3jService, CompileService, BaasService } = require('../packages/api');
const { waitFor } = require('./utils');

const config = new Configuration(path.join(__dirname, './conf/config.json'));
const compileService = new CompileService(config);
const web3jService = new Web3jService(config);
const baasService = new BaasService(config);

describe('test baas api', () => {
    it('get block height', async () => {
        let response = await baasService.getMaxBlockNumber();
        should.exist(response);
        should.equal(0, response.data.code);
    });

    it('get cns info', async () => {
        let response = await baasService.getCNSInfo('Token', '1.0.0');
        should.exist(response);
        should.equal(0, response.data.code);
    });

    it('get org public key', async () => {
        let response = await baasService.getOrgPublicKey(13);
        should.exist(response);
        should.equal(0, response.data.code);
    });

    it('get block by number', async () => {
        let response = await baasService.getBlockByNumber(100, true);
        should.exist(response);
        should.equal(0, response.data.code);
    });

    it('get transaction by hash', async () => {
        let response = await baasService.getTransactionByHash('0x7559256ebada1476619fb5578d50d2208ae459fc774b4e258ab50779da7da028');
        should.exist(response);
        should.equal(0, response.data.code);
    });

    it('get receipt by hash', async () => {
        let response = await baasService.getReceiptByHash('0x7559256ebada1476619fb5578d50d2208ae459fc774b4e258ab50779da7da028');
        should.exist(response);
        should.equal(0, response.data.code);
    });

    it('send tx', async () => {
        let request = await baasService.genTxRequest("HelloWorld", '1.1.18', 'set', ["niu bi"], 'alice');
        let response = await baasService.sendRaw(request);
        should.exist(response);
        should.equal(0, response.data.code);
    });

    it('send tx function overload', async () => {
        let request = await baasService.genTxRequest("Htt4", '0.0.4', 'set', ["abc"], 'alice');
        let response = await baasService.sendRaw(request);
        should.exist(response);
        should.equal(0, response.data.code);

        request = await baasService.genTxRequest("Htt4", '0.0.4', 'set(int256)', ["123"], 'alice');
        response = await baasService.sendRaw(request);
        should.exist(response);
        should.equal(0, response.data.code);
    });

    it('call', async () => {
        let request = await baasService.genTxRequest("HelloWorld", '1.1.18', 'get', [], 'alice');
        let response = await baasService.sendRaw(request);
        should.exist(response);
        should.equal(0, response.data.code);
    });

    it('get Contract Tx Result', async () => {
        let result = await baasService.getContractTxResult("HelloWorld", '1.1.18', 'get', [], 'alice');
        should.exist(result);
        should.equal("niu bi", result[0]);
    });
});