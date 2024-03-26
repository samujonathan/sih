var express = require("express");
const bcrypt = require("bcrypt");
const rounds = 10;
var router = express.Router();

var pool = require("./pool");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", function (req, res) {
  const data = req.body;
  const account_type = data.account_type || 1; // its 1 for patient
  const saltRounds = 10;
  const yourPassword = data.password;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(yourPassword, salt, (err, hash) => {
      if (account_type == 1) {
        pool.query(
          `INSERT INTO patients (f_name, l_name, email, passhash, user_name, age, gender) 
          VALUES ('${data.first_name}', '${data.last_name}', '${data.userEmail}', '${hash}', '${data.user_name}', ${data.age}, '${data.gender}')`,
          (error, result) => {
            if (error) {
              res.status(404).send(error.message);
            } else {
              res.status(200).send("successful");
            }
          }
        );
      } else {
        console.log(req.body);
        pool.query(
          `INSERT INTO doctors (email, passhash) VALUES
					('${data.userEmail}', '${hash}')`,
          (error, result) => {
            if (error) {
              res.status(404).send(error.message);
            } else {
              res.status(200).send("successful");
            }
          }
        );
      }
    });
  });
});

router.post("/login", function (req, res) {
  const data = req.body;
  console.log(data);
  const yourPassword = data.password;
  pool.query(
    `SELECT (passhash) FROM patients WHERE user_name='${data.user_name}'`,
    (error, result) => {
      if (error) {
        res.status(404).send(error.message);
      } else {
        bcrypt.compare(yourPassword, result.rows[0]?.passhash, (err, pass) => {
          if (err) {
            console.log(err);
            res.status(400).send(err.message);
          } else {
            if (!pass) {
              console.log("incorrect password");
              res.status(401).send("Incorrect password");
            } else {
              let cookie_val = {
                reg_no: data.user_name,
              };
              res.cookie("userCookie", cookie_val);
              res.send(data.user_name);
            }
          }
        });
      }
    }
  );
});

module.exports = router;
