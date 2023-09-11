const {Router} = require ("express");
const router = Router();

const followCtrl = require("../controller/follow.controller");

router.post('/user/follow/:id_user/:id_follower', followCtrl.postFollow);
router.post('/user/unfollow/:id_user/:id_follower', followCtrl.postUnfollow);
router.get('/user/check/:id_user/:id_follower', followCtrl.getcheckFollow)




module.exports = router;