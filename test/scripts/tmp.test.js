const expect = require('chai').expect;

describe.skip('本地测试', function () {
    it('测试 keys', function () {
        expect({a: 1, b: 1}).to.be.an('object').and.to.have.keys('a');
    });
});