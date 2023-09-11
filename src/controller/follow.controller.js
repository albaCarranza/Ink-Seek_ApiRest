const { Pool } = require("../database");

const postFollow = async (req, res) => {

  try {
    let id_user = req.params.id_user;
    let id_follower = req.params.id_follower;
 

    let respuesta;

    let sqlCheck = "SELECT * FROM follow WHERE id_user = ? AND id_follower = ?";
    let paramsCheck = [id_user, id_follower];

    let [resCheck] = await Pool.query(sqlCheck, paramsCheck);
    

    if (resCheck.length > 0) {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Ya sigues a este usuario",
        data: null
      }
    } else {
      let sqlInsert = "INSERT INTO follow (id_user, id_follower) VALUES (?, ?)";
      let paramsInsert = [id_user, id_follower];

      await Pool.query(sqlInsert, paramsInsert);

      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Usuario seguido",
        data: null
      };
    }

    res.send(respuesta);
  } catch (err) {
  }
};

const postUnfollow = async (req, res) => {
  try {
    let id_user = req.params.id_user;
    let id_follower = req.params.id_follower;

    let respuesta;

    let sqlCheck = "SELECT * FROM follow WHERE id_user = ? AND id_follower = ?";
    let paramsCheck = [id_user, id_follower];

    let [resCheck] = await Pool.query(sqlCheck, paramsCheck);

    if (resCheck.length === 0) {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "No sigues a este usuario",
        data: null
      };
    } else {
      let sqlDelete = "DELETE FROM follow WHERE id_user = ? AND id_follower = ?";
      let paramsDelete = [id_user, id_follower];

      await Pool.query(sqlDelete, paramsDelete);

      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Dejaste de seguir al usuario exitosamente",
        data: null
      };
    }

    res.send(respuesta);
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getcheckFollow = async (req, res) => {
  try {
    let id_user = req.params.id_user;
    let id_follower = req.params.id_follower;

    let respuesta;

    let sqlCheck = "SELECT * FROM follow WHERE id_user = ? AND id_follower = ?";
    let paramsCheck = [id_user, id_follower];

    let [resCheck] = await Pool.query(sqlCheck, paramsCheck);


    res.send(resCheck.length > 0);
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }

}

module.exports = { postFollow, postUnfollow, getcheckFollow };