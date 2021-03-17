let express = require('express');
var router = express.Router();
const db = require("../config/connect");
let orderManagmentService = require("../services/orderManagement");
const sn=require('servicenow-rest-api');
var path= require('path')


/** Default Route **/
 router.get('',(req,res) => {
   //res.send("Hello world");
    res.sendFile(path.join(__dirname + '../../amazon3.html'));
})
 
/** getAllOrders **/
router.post("/getAllOrders", async (req, res) => {
  const response = await orderManagmentService.getAllOrders();
  res.json(response);
});
 
/**  getAllDelivery **/
router.post("/getAllDelivery", async (req, res) => {
  const response = await orderManagmentService.getAllDelivery();
  res.json(response);
});
 
/** getAllCancellationDetails **/
router.post("/getAllCancellationDetails", async (req, res) => {
  const response = await orderManagmentService.getAllCancellationDetails();
  res.json(response);
});


/** Dialogflow Webhook **/
router.post('/dialogflow/webhook', async(req,res) => {
  let result = [];
  let data = {};
  if(req.body.queryResult.action==="register_complaint"){
      const ServiceNow=new sn('dev78226','admin','bWE9diVeg4CQ');
      let arrData =  orderManagmentService.getDataForRegisterComplaint(req);
      /** Authenticating user **/
      ServiceNow.Authenticate();
      var category=arrData.category;
      var prior = orderManagmentService.getPriority(category);
      var msg = orderManagmentService.getMsg(arrData);
      const payload=orderManagmentService.getPayload(msg,prior);
      ServiceNow.createNewTask(payload,'incident',response=>{
        let result = orderManagmentService.getResponseForRegisterComplaint(response,arrData);
        res.json(result);
      });
  }

    if(req.body.queryResult.action==="track_complaint_status"){
        let incidentno = req.body.queryResult.parameters.complaintno;
        const data={'comments':'will be resolved in next 48 hours'};
        let sn=require('servicenow-rest-api');
        let ServiceNow=new sn('dev78226','admin','bWE9diVeg4CQ');
        ServiceNow.Authenticate(res=>{});


        /**
         * number
         * short_description
         * priority
         */
        /**  We can pass the parameter in fields array and get the data accordingly */
        const fields=['priority'];
        const filters=['number='+incidentno];
        
        ServiceNow.getTableData(fields,filters,'incident',function(response){
              const result = orderManagmentService.getResponseForTrackingComplaintStatus(response,incidentno);
              res.json(result);
        });
        
    }

    if(req.body.queryResult.action === "cancel_product"){
        
        let outContextVariable = orderManagmentService.getContextObject(req);
        let orderId = outContextVariable.orderid;
        let reason = outContextVariable.reason;
        
        if(typeof orderId == 'undefined' || orderId ==""){
            return res.json({
                  "code": 204,
                  "message": "OrderId is Missing"
              });
              
          }else{
            const sql = orderManagmentService.getOrderManagementQuery(orderId,req,db.connection);
            const data = await orderManagmentService.cancelOrder(orderId,req,db.connection,sql,reason);
            const response = orderManagmentService.getResponseForCancelOrder(data,orderId);
            console.log("response",response);
            res.json(response);
          }
    }


    if(req.body.queryResult.action === "track_status"){
        let orderId = req.body.queryResult.parameters.order_id;
        if(orderId == 'undefined'){
            return res.json({
                  "code": 204,
                  "message": "OrderId is Missing"
              });
              
          }else{
               const data = await orderManagmentService.getTrackingStatus(orderId);
               const response = orderManagmentService.getResponseForTrackingStatus(data,orderId);
               res.json(response);
          }
    }
    
});


module.exports = router;