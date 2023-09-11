const {Router} = require ("express");
const router = Router();
const eventCtrl = require("../controller/events.Controller");

router.get("/events", eventCtrl.getEvents);
router.post("/evento/:id_user", eventCtrl.postEvent);
router.delete("/evento/:id_evento", eventCtrl.deleteEvent);
router.get("/evento/search", eventCtrl.searchEvent);

module.exports=router;
