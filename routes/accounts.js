const express = require("express");
const router = express.Router();
const validate = require("../middleware/validateToken");
const {getOneFavourite, 
    getFavourites, 
    addFavorite, 
    updateMovie, 
    deleteMovie,
    find_view,
    find,
    homePage,
    found} = require("../controller/accountsController");
router.use(validate);
router.route('/:id/FindAMovie').get(find_view);
router.route('/:id/find').post(find);
router.route('/userPAGE/:id').get(homePage);
router.route('/test').get(getFavourites)
router.route('/:id').get(getOneFavourite).put(updateMovie).delete(deleteMovie);
router.route('/:id/found').get(found);
module.exports = router;

