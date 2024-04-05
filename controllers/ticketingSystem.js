const ticketsSchema = require("../models/ticketingSystem")
const carListings = require("../models/carListings")
const {StatusCodes} = require("http-status-codes")



const launchComplaint = async(req,res)=>{
    req.body.user_id = req.user.userID
    const owner = await carListings.findOne({_id:req.body.item})
    req.body.itemOwnerId = owner.ownerId
    req.body.resolveStatus = false
    console.log(req.body)
    const ticket = await ticketsSchema.create(req.body)
    if (!ticket){
        res.status(StatusCodes.OK).json({message:"no items in body",data:{},status_code:StatusCodes.OK})
    }
    res.status(StatusCodes.CREATED).json({message:"created item",data:ticket,status_code:StatusCodes.CREATED})

} 


const getComplaintsOnMyProduct = async(req, res)=>{
    const user = req.user.userID
    const tickets = await ticketsSchema.find({itemOwnerId:user}).sort('createdAt')   
    if(!tickets){
        res.status(StatusCodes.OK).json({message:"no complaints",data:{},status_code:StatusCodes.OK})
    }
    res.status(StatusCodes.OK).json({message:"these are the complaints", data:tickets, status_code:StatusCodes.OK}) 
}


const getMyComplaints = async(req, res)=>{
    const user = req.user.userID
    const tickets = await ticketsSchema.find({user_id:user}).sort('createdAt')
    if(!tickets){
        res.status(StatusCodes.OK).json({message:"no complaints",data:{},status_code:StatusCodes.OK})
    }
    res.status(StatusCodes.OK).json({message:"these are your complaints", data: tickets, status_code:StatusCodes.OK}) 
}

const adminGetAllComplaints = async(req,res)=>{
    const tickets = await ticketsSchema.find({}).sort('createdAt')
    if (!tickets){
        res.status(StatusCodes.OK).json({message:"no complaints",data:{},status_code:StatusCodes.OK})
    }
    res.status(StatusCodes.OK).json({message:"these are the complaints", data: tickets, status_code:StatusCodes.OK}) 
}

const updateComplaintResolveStatus = async(req, res)=>{
    const item_id = req.params.id
    const update_status = {resolveStatus: true}
    const statusUpdate = await ticketsSchema.findOneAndUpdate({_id:item_id}, update_status, {new:true, runValidators:true})
    res.status(StatusCodes.OK).json({message:"update Succesful", data: statusUpdate, status_code:StatusCodes.OK})
}

module.exports = {launchComplaint, getComplaintsOnMyProduct, getMyComplaints, updateComplaintResolveStatus, adminGetAllComplaints}