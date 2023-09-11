const { response } = require("express");
const { Pool } = require("../database");

const addCita = async (request, response) => {
  try {
    const { id_user, email, fecha, hora, asunto } = request.body;

    const sql = "INSERT INTO cita (id_user, email, fecha, hora, asunto) VALUES (?, ?, ?, ?, ?)";
    const params = [id_user, email, fecha, hora, asunto];

    const [result] = await Pool.query(sql, params);

    let respuesta;

    if (result.affectedRows > 0) {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Cita agregada exitosamente",
        data: result
      };
    } else {
      respuesta = {
        error: true,
        codigo: 200,
        mensaje: "No se pudo agregar la cita",
        data: null
      };
    }

    response.send(respuesta);
  } catch (error) {
    
    response.status(500).send("Error al agregar la cita");
  }
};

const getCitas = async (req, res) => {
  try {
    const id_user = req.params.id_user;
    const params = [id_user];
    const sql = "SELECT c.hora, c.id_cita, c.fecha, c.asunto, u.name, u.last_name FROM cita AS c INNER JOIN user AS u ON (u.id_user = c.email ) WHERE c.id_user = ?";
    const [result] = await Pool.query(sql, params);
    console.log(result);

    let respuesta;

    if (result.length > 0) {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Citas obtenidas exitosamente",
        data_citas: result
      };
    } else {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "No se encontraron citas para el usuario",
        data_citas: null
      };
    }

    res.send(respuesta);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al obtener las citas");
  }
};

const getCitasByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const params = [email];
    const sql = "SELECT c.hora, c.id_cita, c.fecha, c.asunto, u.email, u.name, u.last_name FROM cita AS c INNER JOIN user AS u ON (u.id_user = c.id_user ) WHERE c.email = ?";
    const [result] = await Pool.query(sql, params);

    let respuesta;

    if (result.length > 0) {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Citas obtenidas exitosamente",
        data_citas: result
      };
    } else {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "No se encontraron citas para el usuario",
        data_citas: null
      };
    }

    res.send(respuesta);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al obtener las citas");
  }
};

const getCitasId = async (req, res) => {
  try {
    const id_cita = req.params.id_cita;
    const params = [id_cita];
    const sql = "SELECT c.hora, c.id_cita, c.fecha, c.asunto, u.email, u.name, u.last_name FROM cita AS c INNER JOIN user AS u ON (u.id_user = c.email ) WHERE c.id_cita = ?";
    const [result] = await Pool.query(sql, params);
    console.log(result);

    let respuesta;

    if (result.length > 0) {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Cita obtenida exitosamente",
        data_cita: result[0]
      };
    } else {
      respuesta = {
        error: true,
        codigo: 200,
        mensaje: "No se encontró la cita",
        data_cita: null
      };
    }

    res.send(respuesta);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al obtener la cita");
  }
};

const modificarCita = async (request, response) => {
  try {
    const id_cita = request.params.id_cita;
    console.log('ID de cita:', id_cita);
    const { fecha, hora, asunto } = request.body;
    console.log('Datos de la cita:', fecha, hora, asunto);

    const sql = "UPDATE cita SET fecha = ?, hora = ?, asunto = ? WHERE id_cita = ?";
    const params = [fecha, hora, asunto, id_cita];
    console.log('Consulta SQL:', sql);
    console.log('Parámetros:', params);

    const [result] = await Pool.query(sql, params);
    console.log('Resultado de la consulta:', result);

    let respuesta;

    if (result.affectedRows > 0) {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Cita modificada exitosamente",
        data: result
      };
    } else {
      respuesta = {
        error: true,
        codigo: 200,
        mensaje: "No se pudo modificar la cita",
        data: null
      };
    }

    response.send(respuesta);
  } catch (error) {
    console.log(error);
    response.status(500).send("Error al modificar la cita");
  }
};

const eliminarCita = async (req, res) => {
  try {
    const id_cita = req.params.id_cita;
    const params = [id_cita];
    const sql = "DELETE FROM cita WHERE id_cita = ?";
    const [result] = await Pool.query(sql, params);

    let respuesta;

    if (result.affectedRows > 0) {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Cita eliminada exitosamente"
      };
    } else {
      respuesta = {
        error: true,
        codigo: 200,
        mensaje: "No se pudo eliminar la cita"
      };
    }

    res.send(respuesta);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al eliminar la cita");
  }
};

module.exports = { addCita, getCitas, modificarCita, getCitasId, eliminarCita, getCitasByEmail };
