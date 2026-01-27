import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { publishVideo } from "../controllers/video.controller";

const router=Router();
router.use(verifyJWT)

router.route("/publish-video").post(verifyJWT,upload.fields([
    {
        name:"videoFile",
        maxCount:1
    },
    {
        name:"thumbnail",
        maxCount1
    }
]),publishVideo)

export default router;

