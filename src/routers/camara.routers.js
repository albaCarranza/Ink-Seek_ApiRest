const { Router } = require("express");
const multer = require('multer');
const camaraCtrl = require("../controller/camara.controller");

const storage = multer.memoryStorage(); // Almacenar la imagen en memoria en lugar de guardarla en el sistema de archivos

const upload = multer({ storage });

const router = Router();

router.post('/upload', upload.single('photo'), camaraCtrl.addFoto);

module.exports = router;
