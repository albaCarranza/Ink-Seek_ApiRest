const { request, response } = require("express");
const { Pool } = require("../database");

const postRegister = async (request, response) => {
  try {
    let params = [];
    let sql =
      "INSERT INTO user (name, last_name, email, password, is_Tatuador) VALUES (?, ?, ?, ?, ?)";
    params = [
      request.body.name,
      request.body.last_name,
      request.body.email,
      request.body.password,
      request.body.is_Tatuador ? 1 : 0,
    ];

    const connection = await Pool.getConnection();
    await connection.beginTransaction(); 

    let [result] = await connection.query(sql, params);

    const userId = result.insertId; 

    const photoSql =
      "INSERT INTO photo (id_user, photo) VALUES (?, ?)";
    const photoParams = [userId, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0SEPJ6ZsJBAYDB_lTtCfYcalzu2JFJTfuTw&usqp=CAU"]; 

    await connection.query(photoSql, photoParams);

    const updateSql = "UPDATE user SET id_photo = LAST_INSERT_ID() WHERE id_user = ?";
    const updateParams = [userId];

    await connection.query(updateSql, updateParams);

    await connection.commit(); // Confirma la transacción

    connection.release();

    if (result.insertId) response.send(String(result.insertId));
    else response.send("-1");
  } catch (error) {
    response.send(error);
  }
};



const postLogin  = async (request,response) =>
{
    try 
    {
        
        let respuesta;
        // let sql = "SELECT * FROM user WHERE email = ? AND password = ?";
        let sql = `SELECT user.*, photo.photo,
        (SELECT COUNT(*) FROM follow WHERE id_user = user.id_user) AS follow_count
      FROM user
      JOIN photo ON user.id_photo = photo.id_photo
      WHERE user.email = ? AND user.password = ? AND photo.es_publicacion = 0`
        let params = [request.body.email,
                request.body.password];
        let res = await Pool.query (sql, params);
    
        if (res[0].length > 0){
            respuesta = {
            error:false,
            codigo:200,
            mensaje:"Los datos son correctos",
            data_user: res[0]};
        }else{
            respuesta = {
            error:true,
            codigo:200,
            mensaje:"Los datos son incorrectos",
            data_user: null};
        }
        response.send(respuesta)
      }
        catch (err)
        {
        }
      }
      const obtenerIdUsuario = async (req, res) => {
        try {
          const email = req.params.email;
          const sql = 'SELECT id_user FROM user WHERE email = ?';
          const [result] = await Pool.query(sql, [email]);
          if (result.length > 0) {
            const idUsuario = result[0].id_user;
            res.status(200).json(idUsuario);
          } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
          }
        } catch (error) {
          res.status(500).json({ error: 'Error al obtener el ID del usuario' });
        }
      };
  /////EDITAR PERFIL////
  const editProfile = async (request, response) => {
    try {
      let sql = `
      UPDATE user
      INNER JOIN photo ON user.id_photo = photo.id_photo
      SET user.name = ?, user.last_name = ?, user.email = ?, user.password = ?, user.nickname = ?, user.style = ?, user.studio = ?, user.descripcion = ?, photo.photo = ?
      WHERE user.id_user = ?`;
    
    let params = [
      request.body.name, request.body.last_name, request.body.email, request.body.password, 
      request.body.nickname, request.body.style, request.body.studio, request.body.descripcion, 
      request.body.photo, request.body.id_user
    ];

      let res = await Pool.query(sql, params);
      response.json({
        error: false,
        message: "Perfil actualizado correctamente"
      });
    } catch (error) {
      response.status(500).json({
        error: true,
        message: "Ocurrió un error al actualizar el perfil"
      })
    }
  }
  
//GET TATUADORES DEL EXPLORA
const getTatuadoresExplora = async (request, response) => {
  try {
    let respuesta;
    let sql = `
      SELECT user.*, photo.photo
      FROM user
      INNER JOIN photo ON user.id_photo = photo.id_photo
      WHERE user.is_Tatuador = 1`;
    // let params = [request.params.is_Tatuador]
    let res = await Pool.query(sql);

    if (res[0].length > 0){
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Artistas disponibles",
        data_artistas: res[0]};
    }else{
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Artistas disponibles",
        data_artistas: null};
    }
    response.send(respuesta)
  }
  catch(err){
  }
}   


const getArtistaInfo = async (request,response) => {
  try {
    let params = [request.params.id_user];
    let sql = `
      SELECT user.*, photo.photo
      FROM user
      INNER JOIN photo ON user.id_photo = photo.id_photo
      WHERE user.id_user = ?`;

      let res = await Pool.query (sql, params);
    
      if (res[0].length > 0){
          respuesta = {
          error:false,
          codigo:200,
          mensaje:"Los datos son correctos",
          data_user: res[0]};
      }else{
          respuesta = {
          error:true,
          codigo:200,
          mensaje:"Los datos son incorrectos",
          data_user: null};
      }
      response.send(respuesta)
    }
      catch (err)
      {
      }
}

const getTatuador = async (request,response) => 
  {
      const {search}=request.query
      try
      {
            let respuesta;
            let res = await Pool.query(
            `SELECT user.*, photo.photo
            FROM user
            INNER JOIN photo ON user.id_photo = photo.id_photo
            WHERE nickname LIKE ? or style LIKE ? or studio LIKE?`,
             [`%${search}%`,`%${search}%`,`%${search}%`]);
            console.log(search); 
            
          if (res[0].length > 0){
              respuesta = {
              error:false,
              codigo:200,
              mensaje:"Tatuadores encontrados",
              data: res[0]};
          }else{
              respuesta = {
              error:true,
              codigo:200,
              mensaje:"no hay tatuadores",
              data: null};
          }
          response.send(respuesta)
      }
      catch(err)
      {
      }
  }

//VISTA PERFIL PROPIA
const getUserTatuadorInfo = async (request, response) => {
  try {
    let params = [request.params.id_user];
    let respuesta;
    let sql = "SELECT * FROM photo WHERE id_user = ? AND es_publicacion = 1 ORDER BY id_photo DESC;";
    let [result] = await Pool.query(sql, params);

    respuesta = {
      error: false,
      codigo: 200,
      mensaje: 'funciona',
      data_foto: result
    };

    response.send(respuesta)

  } catch (err) {
  } 
};

      const deletePublicacion = async (request, response) => {
        try{
          let respuesta;
          let sql = "DELETE FROM photo WHERE id_photo = '"+ request.body.id_photo +"'"

          let [result] = await Pool.query(sql);

          respuesta = {
            error: false,
            codigo: 200,
            mensaje: "publicacion borrada",
            data_foto: result
          };

          response.send(respuesta)
      }
      catch(err)
      {
      }
      }

const postOpinion = async (request, response) => {
  try {
   
    let params = [];
    let respuesta;
    let sql2 = `INSERT INTO opiniones (emisor, receptor, comentario, puntuacion) VALUES (?,?,?,?)`;
    params = [
      request.body.emisor,
      request.body.receptor,
      request.body.comentario,
      request.body.puntuacion,
    ]
    
    let [result] = await Pool.query(sql2, params);
    respuesta = {
      error: false,
      codigo: 200,
      mensaje: "opinion enviada",
      data_opinion: result
    };


    response.send(respuesta)

  } catch (error) {
    console.error(error);
    response.send(error);
  }

};

//esto lo hago para mostrar las opiniones en la vista tatuador
const getOpiniones = async (request, response) => {
  try {
    let respuesta;
    let params = []
    let sql = "SELECT id_opiniones, emisor, receptor, comentario, puntuacion, respuestaTatuador, photo, name FROM opiniones JOIN user ON (opiniones.emisor = user.id_user) JOIN photo ON (user.id_photo = photo.id_photo) WHERE receptor = ?"
console.log(sql);
    params = [request.params.receptor]
    let [result] = await Pool.query(sql, params);
    console.log(result);
    respuesta = {
      error: false,
      codigo: 200,
      mensaje: 'Opiniones obtenidas',
      data_opinion: result
    };
console.log(respuesta);
    response.send(respuesta);
    
  } catch (error) {
  }
};

//para borrar opinion que escribe el usuario
const borrarOpinion = async (request, response) => {
  try{

    let respuesta;
    let sql = "DELETE FROM opiniones WHERE id_opiniones = ?"
    let params = [request.body.id_opiniones];
   
    let [result] = await Pool.query(sql, params);

    respuesta = {
      error: false,
      codigo: 200,
      mensaje: "opinion borrada",
      data_opinion: result
    };

    response.send(respuesta)

  }
  catch (err){
  }
}

//para que el tatuador pueda responder a las opiniones
const postRespuestaOpinion = async (request, response) => {
  try {
    let params = [];
    let sql =
      "UPDATE opiniones SET respuestaTatuador = ? WHERE id_opiniones = ?";
    params = [
      request.body.respuestaTatuador,
      request.params.id_opiniones,
    ];

    const [result] = await Pool.query(sql, params);

    const respuesta = {
      error: false,
      codigo: 200,
      mensaje: "Respuesta enviada correctamente",
      data_respuesta: result,
    };

    response.send(respuesta);
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error: true,
      mensaje: "Error al enviar la respuesta",
    });
  }
};

const calcularPuntuacionMedia = async (req, res) => {
  
  const id_user = req.params.id_user;
  console.log(id_user)
  try {
    const sql = "SELECT AVG(puntuacion) AS puntuacion_media FROM opiniones WHERE receptor = ?";
    const [result] = await Pool.query(sql, [id_user]);
    const puntuacionMedia = result[0].puntuacion_media || 0;
    console.log(result)
    console.log(puntuacionMedia)

    const respuesta = {
      error: false,
      codigo: 200,
      mensaje: "Puntuación media calculada correctamente",
      puntuacion_media: puntuacionMedia,
    };

    res.json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      mensaje: "Error al calcular la puntuación media",
    });
  }
};






module.exports = { postRegister, postLogin, getUserTatuadorInfo, deletePublicacion, postOpinion, getOpiniones, borrarOpinion, obtenerIdUsuario, editProfile, getTatuadoresExplora, getArtistaInfo, getTatuador, postRespuestaOpinion, calcularPuntuacionMedia};