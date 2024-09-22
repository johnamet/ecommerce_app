#!/usr/bin/node

class PrettyPrint{

    /**
     * Prints the json response in a readable format.
     * @param {object} req - An express request object
     * @param {object} res - An express response object
     * @param {Function} next - An express next function
     */
    static printPretty(req, res, next){
        const originalSend = res.send;
        res.send = function (body) {
            if (typeof body === 'object') {
                body = JSON.stringify(body, null, 2); // Pretty-print with 4 spaces
                res.setHeader('Content-Type', 'application/json');
            }
            originalSend.call(this, body);
        };
        next();
    }
}

export default PrettyPrint;