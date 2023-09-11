const {Router} = require("express");
const router = Router();
const chatCtrl = require("../controller/chat.controller");


router.get("/chats", chatCtrl.getChats)

// router.get("/chats/:id_user2", chatCtrl.getChatsUser2)

router.get("/chat/:id_chat", chatCtrl.getMensajes);

router.get("/chats/:id_user1/:name", chatCtrl.getOneChat);

router.post("/chat", chatCtrl.postMensaje);

router.post ("/chats", chatCtrl.postChat);

router.delete("/chats", chatCtrl.deleteChat)


module.exports = router