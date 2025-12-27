import User from "../models/user.model.js";
import FriendRequest from "../models/FriendRequest.js";
import e from "express";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currUser=req.user;


        const recommendedUsers= await User.find({
            $and:[
                {_id:{$ne:currentUserId}},
                {_id:{$nin:currUser.friends}},
                {isOnboarder:true}
            ]   
        })
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id).select("friends")
        .populate("friends", "fullName profilePic nativeLanguage learningLanguage ");//populate used to grab user dewtails from friends array

        res.status(200).json(user.friends);


    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myIdId = req.user.id;
        const {id:recipientId} = req.params; 

        //prevent sending request to oneself
        if(myId === recipientId){
            return res.status(400).json({message:"Cannot send friend request to yourself"});
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message:"Recipient user not found"});
        }

        //check if already friends

        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"User is already your friend"});
        }
        const existingRequest = await FriendRequest.findOne({
            $or:[
                {sender:myId, recipient:recipientId},
                {sender:recipientId, recipient:myId},
            ],
        });

        //check if friend request already exists
        if(existingRequest){
            return res.status(400).json({message:"Friend request already exists"});
        }

        const friendRequest = new FriendRequest({
            sender:myId,
            recipient:recipientId,
        });
        
        res.status(201).json( friendRequest);
    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        
        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found"});
        }
        // verify that the logged-in user is the recipient of the friend request
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({message:"Not authorized to accept this friend request"});
        }
        friendRequest.status="accepted";
        await friendRequest.save();

        //update both users' friends lists
        //$addToSet add element to array only if it doesn't already exist
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet:{friends:friendRequest.recipient},
        });
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet:{friends:friendRequest.sender},
        });
        res.status(200).json({message:"Friend request accepted"});
    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getFriendRequests(req, res) {
    try {
        const incomingReqs= await FriendRequest.find({
            recipient:req.user.id,
            status:"pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage ");

        const acceptedReqs= await FriendRequest.find({
            sender:req.user.id,
            status:"accepted",
        }).populate("recipient", "fullName profilePic ");

        res.status(200).json({incomingReqs, acceptedReqs});


    } catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingReqs= await FriendRequest.find({
            sender:req.user.id,
            status:"pending",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage ");

        res.status(200).json(outgoingReqs);
    } catch (error) {
        console.error("Error fetching outgoing friend requests:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}
