const { Pool } = require("../database");

    const postEvent=async(req,res)=>{
    const id_user=req.params.id_user;
    const {photo,title,fecha_inicio,fecha_final,place}=req.body; 
    try{
       const imagen= await Pool.query(`
        INSERT INTO photo (photo, id_user)
        VALUES (?,?)`,
        [photo, id_user]);
    
      // const result=await Pool.query("SELECT LAST_INSERT_ID() AS id")
      // const idPhoto =result[0].id
      // console.log("VAMOS QUE SALE?",idPhoto,result,result[0]);
        
        await Pool.query(`
        INSERT INTO evento(id_photo,title,fecha_inicio,fecha_final,place,id_user) 
        VALUES (LAST_INSERT_ID(),?,?,?,?,?) `,
        [title,fecha_inicio,fecha_final,place,id_user]);
       respuesta={error:false, 
        codigo:200, mensaje:
        "Evento añadido"};
        res.send(respuesta);
    }catch(error){
        respuesta= {error:true, codigo:200, mensaje:"error al añadir evento",error};
        res.send(respuesta);
        console.log("error al añadir evento");
    }
}


const deleteEvent = async (req, res) => {
    const { id_evento } = req.params;
  
    try {
      const IdDeLaMaravillosaTablaFotos= await Pool.query(`
      SELECT * FROM evento
      WHERE id_evento=?`,[id_evento]);
      const id_photo=IdDeLaMaravillosaTablaFotos.id_photo;
      await Pool.query('DELETE FROM evento WHERE id_evento = ?', [id_evento]);
      await Pool.query('DELETE FROM photo WHERE id_photo = ?', [id_photo]);
      const respuesta = {
        error: false,
        codigo: 200,
        mensaje: 'Evento eliminado',
      };
      
      res.send(respuesta);
    } catch (error) {
      const respuesta = {
        error: true,
        codigo: 200,
        mensaje: 'Error al eliminar evento',
        error: error.message,
      };
      res.send(respuesta);
    }
  };

  const getEvents = async (req, res) => {
    try {
      const eventos = await Pool.query(`
      SELECT evento.*, photo.photo AS photo 
      FROM evento 
      LEFT JOIN photo ON evento.Id_photo = photo.id_photo
      ORDER BY evento.fecha_inicio ASC`);
      
  
      const respuesta = {
        error: false,
        codigo: 200,
        mensaje: 'Eventos obtenidos',
        eventos: eventos,
        
      };

      res.send(respuesta);
    } catch (error) {
      const respuesta = {
        error: true,
        codigo: 200,
        mensaje: 'Error al obtener eventos',
        error: error.message,
      };
      res.send(respuesta);
    }
  };

  const searchEvent = async (req, res) => {
    const { search } = req.query;
  
    try {
      const eventos = await Pool.query(
        `SELECT evento.*, photo.photo AS photo FROM evento
        LEFT JOIN photo ON evento.id_photo = photo.id_photo
        INNER JOIN user ON evento.id_user = user.id_user
        WHERE evento.title LIKE ? OR user.name LIKE ?
        ORDER BY evento.fecha_inicio ASC`,
        [`%${search}%`, `%${search}%`]
      );
  
      const respuesta = {
        error: false,
        codigo: 200,
  
        mensaje: 'Eventos encontrados',
        eventos: eventos,
      };
      res.send(respuesta);
    } catch (error) {
      const respuesta = {
        error: true,
        codigo: 200,
        mensaje: 'Error al buscar eventos',
        error: error.message,
      };
      res.send(respuesta);
    }
  };

  module.exports={postEvent,deleteEvent,getEvents,searchEvent}