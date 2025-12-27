
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMyFriends, getRecommendedUsers } from "../controller/user.controller.js";
import { sendFriendRequest } from "../controller/user.controller.js";
import { acceptFriendRequest } from "../controller/user.controller.js";
import { getFriendRequests } from "../controller/user.controller.js";
import { getOutgoingFriendRequests } from "../controller/user.controller.js";



const router = express.Router();
//applies authentication middleware to all routes defined after this line
router.use(protectRoute);

router.get("/", getRecommendedUsers);

router.get("/friends", getMyFriends);


router.post("/friend-request/:id", sendFriendRequest);

router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-request", getFriendRequests);

router.get("/outgoing-friend-requests", getOutgoingFriendRequests);



export default router;