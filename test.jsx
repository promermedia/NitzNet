const cloudbackend = require("appdrag-cloudbackend");
cloudbackend.init(process.env.APIKEY, process.env.APPID);
const { v4: uuidv4 } = require("uuid");
const newToken = uuidv4();
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

exports.handler = async (event, context, callback) => {
  const oldToken = event.POST.token;
  const password = event.POST.password;
  
  await updatePassword()
    .then((res) => {
      const obj = {};
      obj.success = true;
      obj.newToken = newToken;
      callback(null, obj);
    })
    .catch((err) => {
      console.log(err);
      const obj = {};
      obj.success = false;
      obj.error = err;
      callback(null, obj);
    });

  function updatePassword() {
    return new Promise((resolve, reject) => {
      try {
          const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+.])[A-Za-z\d!@#$%^&*()_+.]{2,20}$/; 
        if(!regex.test(password)) return reject("Regex failed")
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            const q = `UPDATE users SET password = ?, token = ? WHERE token = ?`;
            cloudbackend
              .sqlExecuteRawQuery(q, [hash, newToken, oldToken])
              .then((response) => {
                var result = JSON.parse(response);
                if (result && result.affectedRows == 1) resolve();
                else reject("Wrong token");
              });
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  }
};
