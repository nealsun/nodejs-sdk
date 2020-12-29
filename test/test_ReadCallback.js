/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const should = require('should');
const path = require('path');
const fs = require('fs');
const { Configuration, Web3jService, CompileService, ENCRYPT_TYPE } = require('../packages/api');

const config = new Configuration(path.join(__dirname, './conf/config.json'));
const compileService = new CompileService(config);
const web3jService = new Web3jService(config);

describe('test for read callback', function () {
    it('v4 with root path', async () => {
        const v4RootPath = path.join(__dirname, './contracts/v4')
        const contractPath = path.join(__dirname, './contracts/v4/inner/Inner.sol');
        let contractClass = compileService.compile(contractPath, v4RootPath);

        let callLibrary = contractClass.newInstance();

        let address = await callLibrary.$deploy(web3jService);
        should.exist(address);
        await callLibrary["set(string,int256)"]('こんにちわ！', 23456);

        const ret1 = await callLibrary.getName();
        should.exist(ret1)
        should.equal(ret1[0], 'こんにちわ！');

        // await callLibrary.set('Hello World!');

        const ret2= await callLibrary.getValue();
        should.exist(ret2)
        should.equal(ret2[0], 23456);
    });

    it('v4 with read callback', async () => {
        const v4RootPath = path.join(__dirname, './contracts/v4')
        const contractPath = path.join(__dirname, './contracts/v4/inner/Inner.sol');
        let contractClass = compileService.compile(contractPath, null, (importContractName) => {
            let importContractPath = path.join(v4RootPath, importContractName);
            return {
                contents: fs.readFileSync(importContractPath).toString()
            };
        });
        let callLibrary = contractClass.newInstance();

        let address = await callLibrary.$deploy(web3jService);
        should.exist(address);
        await callLibrary['set(int256)'](1234);

        const ret = await callLibrary.getValue();
        should.exist(ret)
        should.equal(ret[0], 1234);
    });

    it('v5 with root path', async () => {
        const v4RootPath = path.join(__dirname, './contracts/v5')
        const contractPath = path.join(__dirname, './contracts/v5/inner/Inner.sol');
        let contractClass = compileService.compile(contractPath, v4RootPath);

        let callLibrary = contractClass.newInstance();

        let _ = await callLibrary.$deploy(web3jService);
        should.equal(true, true);

        await callLibrary.setMap(1234, 2345, 5678);

        const ret = await callLibrary.param(1234, 2345);
        should.exist(ret)
        should.equal(ret[0], 5678);
    });

    it('v5 with read callback', async () => {
        const v4RootPath = path.join(__dirname, './contracts/v5')
        const contractPath = path.join(__dirname, './contracts/v5/inner/Inner.sol');
        let contractClass = compileService.compile(contractPath, null, (importContractName) => {
            let importContractPath = path.join(v4RootPath, importContractName);
            return {
                contents: fs.readFileSync(importContractPath).toString()
            };
        });
        let callLibrary = contractClass.newInstance();

        let _ = await callLibrary.$deploy(web3jService);
        should.equal(true, true);
    });
});
