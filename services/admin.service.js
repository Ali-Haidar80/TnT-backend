const pool = require("../config/DbConfig");
const adminQueries = require("../queris/admin");

const postData = async (reqBody, files) => {
  try {
    const promisePool = pool.promise();
    const values = reqBody?.title?.map((item, idx) => [
      item,
      reqBody?.description?.[idx],
    ]);

    // query to insert cards data
    const data = await promisePool.query(adminQueries.insertCard, [values]);
    if (data) {
     
      // query to insert get card data
      const [rows] = await promisePool.query(adminQueries.getCardData);
      let ids = rows?.slice(-3);
      ids = ids.map((item) => item.id);
      const { image, video, giff } = files;

      const adminValues = [
        [
          reqBody.heading,
          ids.toString(),
          image?.[0]?.path,
          video?.[0].path,
          giff?.[0].path,
        ],
      ];
     
      // query to insesrt data to admin table
      const [result] = await promisePool.query(
        adminQueries.insertData([
          image?.[0].fieldname,
          video?.[0].fieldname,
          giff?.[0].fieldname,
        ]),
        [adminValues]
      );
      if (!result) throw "Someting went wrong";
      return result;
    } else {
      throw Error("Something went wrong");
    }
  } catch (err) {
    return err;
  }
};

const getData = async () => {
  try {
    const poolPromise = pool.promise();
    
    // query for get admin data
    const [data] = await poolPromise.query(adminQueries.getAdminData);
    const dataRows = [];

    for (const item of data) {
      const conditions = item?.cards?.split(",").map((val) => `id=${val}`);
    
      // query to get specific card data
      const [result] = await poolPromise.query(
        adminQueries.getSpecificCards(conditions)
      );
      dataRows.push({ ...item, cards: result });
    }

    if (dataRows) return dataRows;
  } catch (err) {
    return err;
  }
};
const deleteData = async (params) => {
  try {
    const poolPromise = pool.promise();
    const cardIDs = [
      parseInt(params.id1),
      parseInt(params.id2),
      parseInt(params.id3),
    ];
    
    // query for delete admin data
    const [res] = await poolPromise.query(
      adminQueries.deleteAdminData,
      params.id0
    );
    
    // query for delete card data
    cardIDs.forEach(async (item) => {
      const [resp] = await poolPromise.query(
        `DELETE FROM card WHERE id = ?`,
        item
      );
    });

    return res.affectedRows;
  } catch (err) {
    return err;
  }
};

const patchData = async (reqBody, files) => {
  try {
    const promisePool = pool.promise();

    const values = reqBody?.title?.map((item, idx) => [
      item,
      reqBody?.description?.[idx],
    ]);

    // query for get card data
    const [cardIDs] = await promisePool.query(
      adminQueries.getCardsID(+reqBody.id)
    );

    cardIDs[0]?.cards?.split(",").map(async (id, idx) => {
      const title = values[idx][0];
      const description = values[idx][1];

      // query for updating card data
      const [ack] = await promisePool.query(adminQueries.updateCard, [
        { title, description },
        parseInt(id),
      ]);

      if (!ack) throw "Someting went wrong";
    });

    const id = parseInt(reqBody.id);
    const heading = reqBody.heading;
    const image = files?.image[0]?.path;
    const video = files?.video[0]?.path;
    const giff = files?.giff[0]?.path;

    // query for updating admin data
    const [result] = await promisePool.query(adminQueries.updateAdminData, [
      { heading, image, video, giff },
      id,
    ]);

    if (!result) throw "Someting went wrong";

    return result.affectedRows;
  } catch (err) {
    return err;
  }
};

module.exports = { postData, getData, patchData, deleteData };
