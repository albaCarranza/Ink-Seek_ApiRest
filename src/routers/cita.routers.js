const { Router } = require("express");
const router = Router();
const citaCtrl = require("../controller/cita.controller");

router.post('/add-cita', citaCtrl.addCita);
router.get('/citas/:id_user', citaCtrl.getCitas);
router.get('/citas/email/:email', citaCtrl.getCitasByEmail);
router.get('/cita/:id_cita', citaCtrl.getCitasId);
router.put('/cita/:id_cita', citaCtrl.modificarCita);
router.delete('/cita/:id_cita', citaCtrl.eliminarCita);

module.exports = router;