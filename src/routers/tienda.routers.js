const {Router} = require ("express");
const router = Router();
const tiendaCtrl = require ("../controller/tienda.controller");



router.get("/tienda", tiendaCtrl.getProducto)

router.get("/tiendas", tiendaCtrl.getProducto);

router.post("/tienda", tiendaCtrl.postProducto)

router.delete("/tienda/:id_producto", tiendaCtrl.deleteProducto);

module.exports = router