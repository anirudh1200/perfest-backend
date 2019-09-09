var { resetPassword } = require('../app/controllers/mailController');
var expect = require('chai').expect;
describe("#resetPassword",()=>{
    context('with null object',()=>{
        it('should return true',()=>{
            expect(resetPassword(null)).to.equal(true);
        })
    })
})
