const { Pool } = require("../database");

const getProducto = async (req, res) => {
  try {
    const id_user = req.query.id_user;
    let sql =
      "SELECT name, photo, photo.id_photo, producto.id_producto FROM producto JOIN photo ON(producto.id_photo = photo.id_photo) WHERE photo.id_user = ?";
    let params = [id_user];

    let [result] = await Pool.query(sql, params);

    if (result.length > 0) {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "todos los datos enviados satisfactoriamente",
        data_prenda: result,
      };
      res.send(respuesta);
    } else {
      respuesta = {
        error: true,
        codigo: 404,
        mensaje: "No se encontraron productos para el usuario",
      };
      res.status(404).send(respuesta);
    }
  } catch (err) {
    console.error("Error al obtener los productos:", err.message);
    const respuesta = {
      error: true,
      codigo: 500,
      mensaje: "Error al obtener los productos",
    };
    res.status(500).send(respuesta);
  }
};

const postProducto = async (req, res) => {
  try {
    const photoQuery = "INSERT INTO photo (photo, id_user, es_publicacion) VALUES (?, ?, 0)";
    const photoParams = [req.body.photo, req.body.id_user];

    const [photoResult] = await Pool.query(photoQuery, photoParams);
    const id_photo = photoResult.insertId;

    const productoQuery = "INSERT INTO producto (name, id_user, id_photo) VALUES (?, ?, ?)";
    const productoParams = [req.body.name, req.body.id_user, id_photo];

    const [productoResult] = await Pool.query(productoQuery, productoParams);

    const respuesta = {
      error: false,
      codigo: 200,
      mensaje: "Producto agregado correctamente",
      producto: {
        id_producto: productoResult.insertId,
        name: req.body.name,
        photo: req.body.photo,
      },
    };
    res.send(respuesta);
  } catch (err) {
    console.error("Error al agregar el producto:", err.message);
    const respuesta = {
      error: true,
      codigo: 500,
      mensaje: "Error al agregar el producto",
    };
    res.status(500).send(respuesta);
  }
};


const deleteProducto = async (req, res) => {
  try {
    const id_producto = req.params.id_producto;
    let respuesta;

    let sql = "DELETE FROM producto WHERE id_producto = ?";

    let [result] = await Pool.query(sql, [id_producto]);

    if (result.affectedRows > 0) {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "producto borrado satisfactoriamente",
      };
      res.send(respuesta);
    } else {
      respuesta = {
        error: true,
        codigo: 404,
        mensaje: "No se encontró el producto con el id proporcionado",
      };
      res.status(404).send(respuesta);
    }
  } catch (err) {
    console.error("Error al eliminar el producto:", err.message);
    const respuesta = {
      error: true,
      codigo: 500,
      mensaje: "Error al eliminar el producto",
    };
    res.status(500).send(respuesta);
  }
};

module.exports = { getProducto, postProducto, deleteProducto };
