const adminQueries = {
  insertData: (fields) => {
    return `INSERT INTO admin (heading,cards,${fields}) VALUES ?`;
  },
  insertCard: `INSERT INTO card (title,description) VALUES ?`,
  getCardData: "select * from card",
  getAdminData: "select * from admin",
  getSpecificCards: (conditions) => {
    return `select * from card where ${conditions
      .toString()
      ?.replace(/,/g, " or ")}`;
  },
  updateCard: "UPDATE card SET ? WHERE id = ?",
  updateAdminData: "UPDATE admin SET ? WHERE id = ?",
  getCardsID: (id) => {
    return `SELECT cards from admin WHERE id=${id}`;
  },
  deleteAdminData: `delete from admin where id = ?`,
};

module.exports = adminQueries;
