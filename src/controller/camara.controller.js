const { Pool } = require("../database");
const fs = require("fs");
const path = require("path");

const addFoto = async (request, response) => {
  try {
    const { id_user } = request.body;
    const photo = request.file;

    const photoPath = `data:${photo.mimetype};base64,${photo.buffer.toString('base64')}`;

    const sql = "INSERT INTO photo (id_user, photo, es_publicacion) VALUES (?, ?, 1)";
    const params = [id_user, photoPath];

    const [result] = await Pool.query(sql, params);

    let respuesta;

    if (result.affectedRows > 0) {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Foto agregada exitosamente",
        data: result
      };
    } else {
      respuesta = {
        error: true,
        codigo: 200,
        mensaje: "No se pudo agregar la foto",
        data: null
      };
    }

    response.send(respuesta);
  } catch (error) {
    console.log(error);
    response.status(500).send("Error al agregar la foto");
  }
};

module.exports = { addFoto };
