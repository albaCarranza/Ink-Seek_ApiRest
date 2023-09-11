const { Pool } = require("../database");



const homeGetPhotos = async (req, res) => {
    try {
        const id_follower= req.params.id_follower
        const id_user= req.params.id_user
      const fotos = await Pool.query(`
      SELECT p.*, u.nickname AS user_name,(SELECT photo FROM photo WHERE id_user=u.id_user AND es_publicacion=0 LIMIT 1)as photoPerfil
      FROM photo p
      INNER JOIN user u ON p.id_user = u.id_user
      WHERE u.id_user IN (
      SELECT f.id_follower
      FROM follow f
      WHERE f.id_user= ?
      ) AND p.es_publicacion = 1
      ORDER BY p.id_photo DESC
      `,[id_user]);
      const respuesta = {
        error: false,
        codigo: 200,
        mensaje: 'fotos obtenidas',
        fotos: fotos,
      };

      res.send(respuesta);
    } catch (error) {
      const respuesta = {
        error: true,
        codigo: 200,
        mensaje: 'Error al obtener fotos',
        error: error.message,
      };
      res.send(respuesta);
    }
  };


  const homeSearch = async (req, res) => {
    try {
        const search = req.params.search;
        const id_user=req.params.id_user


        const fotos = await Pool.query(`
        SELECT p.*, u.nickname AS user_name,(SELECT photo FROM photo WHERE id_user=u.id_user AND es_publicacion=0 LIMIT 1)as photoPerfil
        FROM photo p
        INNER JOIN user u ON p.id_user = u.id_user
        INNER JOIN follow f ON u.id_user = f.id_follower
        WHERE (u.nickname LIKE ? OR u.name LIKE ? OR u.style LIKE ?) AND f.id_user = ? AND p.es_publicacion = 1
        ORDER BY p.id_photo DESC
        `, [`%${search}%`, `%${search}%`,`%${search}%`, id_user]);



      const respuesta = {
        error: false,
        codigo: 200,
  
        mensaje: 'toma tus fotos',
        fotos: fotos,
      };
      // console.log(respuesta);
      res.send(respuesta);
    } catch (error) {
      const respuesta = {
        error: true,
        codigo: 200,
        mensaje: 'Error al buscar fotos',
        error: error.message,
      };
      // console.log(error);
      // res.send(respuesta);
    }
  };

  module.exports={homeGetPhotos,homeSearch}