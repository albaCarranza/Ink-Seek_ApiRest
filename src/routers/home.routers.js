const {Router} = require ("express");
const router = Router();
const homeController = require("../controller/home.Controller");

router.get(`/home/photos/:id_user`, homeController.homeGetPhotos)
router.get(`/home/search/:id_user/:search`,homeController.homeSearch)



module.exports=router

