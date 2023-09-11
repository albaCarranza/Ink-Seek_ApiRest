const { Pool } = require("../database")




// const getChats = async (req,res) =>{
    
//     try{
//         let respuesta;
//         let params = [];

        
//         let sql = "SELECT id_chat, name, photo  FROM chat JOIN user ON (chat.id_user2 = user.id_user) JOIN photo ON(user.id_photo = photo.id_photo) WHERE id_user1 = ?"

//         console.log(sql);

//         params = [req.params.id_user1];

//         let [result] = await Pool.query(sql, params);
//         console.log(result);


//         respuesta ={
//             error : false, codigo :200 , mensaje :"chats encontrados",
//             data_conversacion : result
//         }
//         res.send(respuesta)
//     }
//     catch(err){
//         res.send(err)
//     }
// }

const getChats = async (req, res) => {

    try {
        let respuesta;
        let params = [req.query.id_user];


        let sql = "SELECT id_chat, name, photo, id_user2  FROM chat JOIN user ON (chat.id_user2 = user.id_user) JOIN photo ON(user.id_photo = photo.id_photo) WHERE id_user1 = ?"

        
        

       

        let [resultUser1] = await Pool.query(sql, params);

        

        sql = "SELECT id_chat, name, photo  FROM chat JOIN user ON (chat.id_user1 = user.id_user) JOIN photo ON(user.id_photo = photo.id_photo) WHERE id_user2 = ?"

        let [resultUser2] = await Pool.query(sql, params);

        

        respuesta = {
            error: false, codigo: 200, mensaje: "chats encontrados",
            data_conversacion: [...resultUser1, ...resultUser2]
        }
        res.send(respuesta)

    }
    catch (err) {
        res.send(err)
    }
}





const getMensajes = async (req, res)=>{

    try{
        let respuesta; 
        let params =[] ;

        let sql = "SELECT mensaje, id_participante FROM mensaje WHERE id_chat = ?"

        params =[
            req.params.id_chat
        ];
        
        let [result] = await Pool.query(sql , params)
        

        respuesta ={
            error : false, codigo : 200, mensaje :"Todos los mensajes obtends",
            data_mensaje : result}

        res.send(respuesta)
    }
    catch(err){
        res.send(err)
    }
}


const getOneChat = async (req, res)=>{
    try{
        let respuesta ;
        let params = [];
        let sql = "SELECT id_chat, id_user1, id_user2 name, photo  FROM chat JOIN user ON (chat.id_user2 = user.id_user) JOIN photo ON(user.id_photo = photo.id_photo) WHERE name = ?"

        params = [req.params.name];   
        
        
        let [result] = await Pool.query(sql, params)
        



        if(result.length > 0){
        respuesta = {
            error : false, codigo : 200, mensaje : "Chat encontrado",
            data_conversacion : result
        }
        
        res.send(respuesta)
    }
    else{
        respuesta = {
            error : false, codigo : 200, mensaje : "No se encontro el chat",
            data_conversacion : result
        }
        res.send(respuesta)
    }
    }
    catch(err){
        res.send(err)
    }
}


const postChat = async (req, res)=>{
    try{
        let respuesta;
        let params = [];
        let sql = "INSERT INTO chat (id_user1 , id_user2) VALUES (?,?)"

        params = [req.body.id_user1,
                req.body.id_user2]

        let [result] = await Pool.query(sql, params)

        respuesta = {
            error : false , codigo : 200, mensaje : "chat creado", id_chat : result.insertId}

        res.send(respuesta)
    }
    catch(err){
        res.send(err)
    }
}

const postMensaje = async (req, res) =>{
    try{
        let respuesta ; 

        let params = [];

        let sql = "INSERT INTO mensaje (mensaje, id_participante, id_chat) VALUES (?,?,?)"


        params = [
            req.body.mensaje,
            req.body.id_participante,
            req.body.id_chat
        ]

        

        let [result] = await Pool.query(sql, params)
        

        
        respuesta ={
            error : false, codigo : 200, mensaje :"Mensaje creado",
            data_mensaje : result
        }
        res.send(respuesta)
    }
    catch(err){
        res.send(err)
    }
}


const deleteChat = async (req, res)=>{
    try{
        let respuesta ; 
        let params = [];

        let sql = "DELETE FROM chat WHERE id_chat = ?"

        

        params =[
            req.body.id_chat
        ];

        let [result] = await Pool.query(sql, params);
        

        respuesta = {
            error: false, codigo : 200, mensaje :"Borrado perro",
            data_conversacion : result
        }
        res.send(respuesta)
    }
    catch(err){
        res.send(err);
    }
}


module.exports = {getChats ,getMensajes, postMensaje, postChat, getOneChat, deleteChat}