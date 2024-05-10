const conn = require("../db/connection");

class User {
  constructor(phone) {
    this.phone = phone;
  }

  async balence() {}
  async register() {}
  async info() {
    const user = { name: "John Doe" };
    return user;
  }
  async buy(data) {
    try {
      const Sql11 = "SELECT * FROM `airtime` WHERE phone=?";
      const sql2 =
        "UPDATE `airtime` set bandle=?,balence=balence-? WHERE phone=?";
      const sql3 = "INSERT INTO `airtime`(balence,phone,bandle) VALUES (?,?,?)";

      const [userdata] = await conn.query(Sql11, [data.phone]);
      if (userdata.length == 1) {
        if (userdata[0].balence >= data.amount) {
          const bandle = `${userdata[0].bandle}|${data.bandle}`;
          const dbr = await conn.query(sql2, [bandle, data.amount, data.phone]);
          return true;
        } else {
          return false;
        }
      } else {
        let bal = 30000 - data.amount;
        await conn.query(sql3, [bal, data.phone, data.bandle]);
        return true;
      }
    } catch (error) {
      throw error;
    }
  }
}
module.exports = User;
