// authMiddleware.js
const jwt = require("jsonwebtoken");

const SECRET_KEY = "your_secret_key";

module.exports = function (req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ message: "Hiányzó token" });
    }

    const realToken = token.split(" ")[1]; // 'Bearer TOKEN'

    jwt.verify(realToken, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Érvénytelen token" });
        }

        req.user = decoded;  // { username, role }
        next();
    });
};

//tesztje postman:Headers- fülhöz: Key:  Authorization , 
//value-hoz Bearer szóköz aztán a token