const axios = require('axios');
var qs = require('qs');
const {
    ServiceBase
} = require('../common/serviceBase');
const { ecsign, hash, signRlp } = require('../common/web3lib/utils');

const HEAD_TIMESTAMP = 'X-LLC-Timestamp';
const HEAD_ORG_ID = 'X-LLC-OrgId';
const HEAD_GROUP_ID = 'X-LLC-GroupId';
const HEAD_VERSION = 'X-LLC-SDK-Version';
const HEAD_LANG = 'X-LLC-SDK-Lang';
const HEAD_SIGN_TYPE = 'X-LLC-SignType';
const HEAD_SIGN = 'X-LLC-Sign';

const SDK_VERSION = '1.0.0';


class BaasClient extends ServiceBase{
    constructor(config) {
        super(config);
        this.client = axios.create({
            timeout: 30 * 1000
        });
        this.client.defaults.responseType = 'json';

        this.client.defaults.validateStatus = function () {
            return true
        };

        this.client.interceptors.request.use(
            option => {
                //签名
                const method = option.method.toUpperCase();
                const timestamp = Date.now()
                const signType = this.config.encryptType;
                const baseUrl = this.config.baas.baseUrl;
                let plainText = `${method}:${timestamp}:${this.config.baas.orgId}:${this.config.groupID}:${SDK_VERSION}:${signType}:${option.url}:`;
                
                if (method === 'GET' && option.params) {
                    plainText = plainText + qs.stringify(option.params)
                } else if (option.data){
                    plainText = plainText + JSON.stringify(option.data)
                }

                let privateKey = Buffer.from(this.config.baas.privateKey, 'hex');
                let msgHash = Buffer.from(hash(plainText, this.config.encryptType),'hex');
                let sign = ecsign(msgHash, privateKey, this.config.encryptType);

                option.baseURL = baseUrl;
                option.headers[HEAD_TIMESTAMP] = timestamp;
                option.headers[HEAD_ORG_ID] = this.config.baas.orgId;
                option.headers[HEAD_GROUP_ID] = this.config.groupID;
                option.headers[HEAD_VERSION] = SDK_VERSION;
                option.headers[HEAD_LANG] = 'javascript';
                option.headers[HEAD_SIGN_TYPE] = signType
                option.headers[HEAD_SIGN] = '0x' + signRlp(sign, this.config.encryptType).toString('hex');

                return option;
            },
            error => Promise.reject(error)
        );
    }

    /**post
     * @param options
     * @return {Promise}
     */
    async post(options) {
        return new Promise((resolve, reject) => {
            this.client(options).then(response => {
                resolve(response)
            })
                .catch(error => {
                    reject(error)
                })
        })
    };

    /**get
     * @param options
     * @return {Promise}
     */
    async get(options) {
        return new Promise((resolve, reject) => {
            this.client(options).then(response => {
                resolve(response)
            })
                .catch(error => {
                    reject(error)
                })
        })
    };

    /**patch
     * @param options
     * @return {Promise}
     */
    async patch(options) {
        return new Promise((resolve, reject) => {
            this.client(options).then(response => {
                resolve(response)
            })
                .catch(error => {
                    reject(error)
                })
        })
    };
    /**put
     * @param options
     * @return {Promise}
     */
    async put(options) {
        return new Promise((resolve, reject) => {
            this.client(options).then(response => {
                resolve(response)
            })
                .catch(error => {
                    reject(error)
                })
        })
    };
    /**delete
     * @param options
     * @return {Promise}
     */
    async deleted(options) {
        return new Promise((resolve, reject) => {
            this.client(options).then(response => {
                resolve(response)
            })
                .catch(error => {
                    reject(error)
                })
        })
    };
}

module.exports.BaasClient = BaasClient;
