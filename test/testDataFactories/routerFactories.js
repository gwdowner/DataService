// res/req factories
module.exports.reqres = (sandbox) => {
    args = {
        req: {},
        res: {
            send: sandbox.spy((data) => args.res),
            status: sandbox.spy((data) => args.res)
        },
        
    }
    return args;
}