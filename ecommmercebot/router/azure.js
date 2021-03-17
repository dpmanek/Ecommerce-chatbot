let express = require('express');
var router = express.Router();
const db = require("../config/connect");
let orderManagmentService = require("../services/orderManagement");
const sn=require('servicenow-rest-api');


  /**** getTrackingStatus ****/
router.post('/getTrackingStatus',async (req,res) => {
    let orderId = req.body.order_id;
    if(orderId !== ""){
      if(orderId == 'undefined'){
          return res.json({
                "code": 204,
                "message": "OrderId is Missing"
            });
        }else{
          const data = await orderManagmentService.getTrackingStatus(orderId);
            console.log(data);
  
            res.send(JSON.stringify(data));
  
          }
      }
  
  })
  
  /** OrderCancellation **/
  router.post('/OrderCancellation',async (req,res) => {
    console.log(req.body);
    let orderId = req.body.order_id;
    let reason = req.body.reason;
    if(orderId !== ""){
      if(typeof orderId == 'undefined' || orderId ==""){
          return res.json({
                "code": 204,
                "message": "OrderId is Missing"
            });
      }else{
        const sql = orderManagmentService.getOrderManagementQuery(orderId,req,db.connection);
        const data = await orderManagmentService.cancelOrder(orderId,req,db.connection,sql,reason);
        console.log(JSON.stringify(data));
        res.send(JSON.stringify(data));
      }
    }
  });
  
  /** RegisterComplaint **/
  router.post('/RegisterComplaint',async(req,res) => {
        const ServiceNow=new sn('dev78226','admin','bWE9diVeg4CQ');
        let arrData = {};
        arrData.givenname = req.body.name;
        arrData.phonenumber = req.body.phone_no ;
        arrData.category = req.body.category;
        arrData.shortdescription = req.body.short_desc;
        /** Authenticating user ***/
        ServiceNow.Authenticate(res=>{});
        var category=arrData.category;
        var prior=orderManagmentService.getPriority(category);
        var msg=orderManagmentService.getMsg(arrData);
        const payload=orderManagmentService.getPayload(msg,prior);
  
        ServiceNow.createNewTask(payload,'incident',response=>{
            response.response = true;
            res.send(JSON.stringify(response));
        });
    
  });
  
  /** TrackComplaint **/
  
  router.post('/TrackComplaint',(req,res) => {
    let incidentno = req.body.complaint_no;
    if(incidentno !==""){
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
          if(response.length===0){
              dataToSend = {response : false}
              console.log(JSON.stringify(dataToSend));
              res.send(dataToSend);
          }else{
              response[0].response = true;
              console.log(JSON.stringify(response[0]));
              res.send(JSON.stringify(response[0]));
          }
        });
  }
  });  

  module.exports = router;
  