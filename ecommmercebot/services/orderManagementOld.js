const { resolve } = require("path");
const db = require("../config/connect");

module.exports.getAllOrders = () => {
  return new Promise((resolve, reject) => {
    let sql = "select order_id,product_name,status from orders";
    db.connection.query(sql, function (err, res) {
      if (err) console.log(err);
      if (res.length > 0) {
        resolve(res);
      }
    });
  });
};
 
module.exports.getAllDelivery = () => {
  return new Promise((resolve, reject) => {
    let sql =
      "select delivery.order_id,orders.product_name,orders.status,delivery.agent_name,delivery.agent_contact from delivery inner join orders on orders.order_id = delivery.order_id";
    db.connection.query(sql, function (err, res) {
      if (err) console.log(err);
      if (res.length > 0) {
        resolve(res);
      }
    });
  });
};
 
module.exports.getAllCancellationDetails = () => {
  return new Promise((resolve, reject) => {
    let sql =
      "select orders.order_id,orders.product_name,orders.status,cancellation.reason from cancellation inner join orders on orders.order_id = cancellation.order_id";
    db.connection.query(sql, function (err, res) {
      if (err) console.log(err);
      console.log(res);
      if (res.length > 0) {
        resolve(res);
      } else {
        resolve([]);
      }
    });
  });
};

module.exports.getOrderManagementQuery = (orderId,req,connection) => {
    if(connection !=="" && orderId!==""){
        /** query to check the sql status **/
        let sql = "SELECT order_id,status,product_name,product_image from orders where order_id = '"+orderId+"' ";
        return sql;
    }
};

module.exports.cancelOrder = (orderId,req,connection,sql,reason) => {
    return new Promise((resolve,reject) => {
         if(connection !=="" && orderId!==""){
            /** executing query  **/
            let data = "";
            let arrData={};
            db.connection.query(sql,async function(err, res, fields){
                if (err) {
                    throw err;
                }

                if(res.length === 0){
                    arrData.response = false;
                    arrData.status = 'Not Found';
                    resolve(arrData);
                }
                
                else{
                    if(res.length > 0 && res[0].status && (res[0].status === "delivered" || res[0].status === "out for delivery" || res[0].status === "cancelled" ) ){
                        arrData.response = true;
                        arrData.status = res[0].status;
                        arrData.isNotAllowed = true;
                        arrData.product_name=res[0].product_name;
                        arrData.product_image=res[0].product_image;
                        resolve(arrData);
                    }else{
                        const isCancelled = await updateCancelOrder(orderId,reason);
                        arrData.response = true;
                        arrData.isNotAllowed = false;
                        arrData.status = res[0].status;
                        arrData.product_name=res[0].product_name;
                        arrData.product_image=res[0].product_image;
                        resolve(arrData);
                    }
                }
            });
        }
    });
   
};

updateStatusForOrders = (orderId) => {
    return new Promise((resolve,reject) => {
         let sql = "update orders set status = 'cancelled' where order_id = '"+orderId+"' ";
          db.connection.query(sql,function(err, res, fields){
                if (err) throw err;
                if(res){
                    resolve(1);
                }
        });
    }); 
}

updateCancelOrder = (orderId,reason) => {
    
    return new Promise((resolve,reject) => {
        let sql = "Insert into cancellation(order_id,reason) values('"+orderId+"','"+reason+"')";
        db.connection.query(sql,async function(err, res, fields){
                if (err) throw err;
                if(res){
                    const isUpdated = await updateStatusForOrders(orderId);
                    if(isUpdated){
                        data = "The Order has been cancelled";
                        resolve(data);
                    }
                }
                 
                
            });
    }); 
}

module.exports.getTrackingStatus = (orderId,reason) => {
    
    return new Promise((resolve,reject) => {
   let arrData = {};
    let sql = "select status,product_name,product_image from orders where order_id = '"+orderId+"'";
    
    db.connection.query(sql,async function(err, res, fields){
               if (err) throw err;
               if(res.length ===0){    
                   arrData.response = false;
                   arrData.status = "Not Found";
                   resolve(arrData);
               }else{
                   if(res.length > 0){
                       if(res[0].status == "out for delivery"){
                           let response = await getDeliveryDetails(orderId);
                           arrData.response = true;
                           arrData.status = res[0].status;
                           arrData.agent_name = response.agent_name;
                           arrData.agent_contact = response.agent_contact;
                           arrData.product_name=response.product_name;
                           arrData.product_image=response.product_image;
                           arrData.status_image = getDynamicImagePath(res[0].status);
                           resolve(arrData);
                           
                       }else{
                           arrData.response = true;
                           arrData.product_name=res[0].product_name;
                           arrData.status = res[0].status;
                           arrData.product_image=res[0].product_image;
                           arrData.status_image = getDynamicImagePath(res[0].status);
                           resolve(arrData);
                       }
                       
                   }
               }
             
           });
   }); 
}

module.exports.getContextObject = (req) => {
    if(req.body.queryResult.outputContexts){
        //  get Session Variables
        let data = {};
        for (var i in req.body.queryResult.outputContexts) {
            var str = req.body.queryResult.outputContexts[i].name;
                if (req.body.queryResult.outputContexts[i].name.includes('session_variable')){
                    data = req.body.queryResult.outputContexts[i].parameters;
                }
            }
           
        let arrData = {};
        arrData.orderid = data.orderid;
        arrData.reason = data.any;
        return arrData;
    }else{
        return null;
    }
}

getDeliveryDetails = (orderId) => {
    console.log("coming in delivery");
    return new Promise((resolve,reject) => {
        if(orderId !==""){
            
            let msg = "";
            let sql = "select delivery.agent_name,delivery.agent_contact,delivery.product_name,orders.product_image from delivery inner join orders on orders.order_id = delivery.order_id where delivery.order_id =  '"+orderId+"' and status = 'out for delivery';";
            db.connection.query(sql,async function(err, res, fields){
                if(err)
                    throw err;
                 if(res.length > 0 ){
                    let arrData = {};
                    arrData.agent_name = res[0].agent_name;
                    arrData.agent_contact = res[0].agent_contact;
                    arrData.product_name=res[0].product_name;
                    arrData.product_image=res[0].product_image;
                    resolve(arrData);
                 }   
            });
        }
    });
    
}

module.exports.getResponseForCancelOrder = (data,orderId) => {
        /** case : Order ID Not Found ****/
        if(data.response == false){
            result={
                "fulfillmentMessages": [
                    {
                      "payload":{
                      "richContent": [
                        [
                          {
                            "type": "description",
                            "title": "Order:"+orderId+"",
                            "text": [
                              "No such order has been placed.",
                            ]
                          }
                        ]
                      ]
                    }
                    },
  
                    {
                      "text": {
                        "text": [
                          "Is there anything else I can help you with?" 
                        ]
                      }
                    },
                    {
                      "payload":{
                    "richContent": [
                      [
                        {
                          "type": "chips",
                          "options": [
                            {
                              "text": "Yes",
                            },
                            {
                              "text": "No",
                            }
                          ]
                        }
                      ]
                    ]
                }
            }

        ]
    
    }
        return result;
}
        /** case : delivered,out for delivery ****/
          else if(data.response == true && (data.status == "delivered" || data.status == "out for delivery" || data.status == "cancelled") ){
            
          /** 
             * changes made by Nikhil ;
             *  changed richcontent types;
             *  Date-05/03/2021   
           */  
              result={
                "fulfillmentMessages": [
                    {
                      "payload":{
                      "richContent": [
                        [
                          {
                            "type": "image",
                            "rawUrl": data.product_image,
                            "accessibilityText": "Image"
                          },
                          {
                            "type": "accordion",
                            "title": "Order: "+orderId+" - "+data.product_name+"",
                            "subtitle":"Not able to cancel",
                            "text": [
                              "Since your order is already "+data.status+" , it cannot be cancelled",
                            ]
                          }
                        ]
                      ]
                    }
                    },
  
                    {
                      "text": {
                        "text": [
                          "Is there anything else I can help you with?" 
                        ]
                      }
                    }
          /** 
            * changes  end  
           */       
  
  
                    ,
                    {
                      "payload":{
                    "richContent": [
                      [
                        {
                          "type": "chips",
                          "options": [
                            {
                              "text": "Yes",
                            },
                            {
                              "text": "No",
                            }
                          ]
                        }
                      ]
                    ]
                      }
                  }
  
              ]
            }
           return result;
                
        }
          /** case : Order cancellation ****/

          /** changes made by Nikhil ; changed richcontent types; Date-05/03/2021   ****/  
          else{
            result={
                "fulfillmentMessages": [
                    {
                      "payload":{
                      "richContent": [
                        [
                          {
                            "type": "image",
                            "rawUrl": data.product_image,
                            "accessibilityText": "Image"
                          },
                          {
                            "type": "accordion",
                            "title": "Order: "+orderId+" - "+data.product_name+"",
                            "subtitle": "Cancelled",
                            "text": [
                              "Your order has been cancelled",
                            ]
                            
                          }
                        ]
                      ]
                    }
                    },
  
                    {
                      "text": {
                        "text": [
                          "Is there anything else I can help you with?" 
                        ]
                      }
                    }
  
           /** Changes end ****/          
  
                    ,
                    {
                      "payload":{
                    "richContent": [
                      [
                        {
                          "type": "chips",
                          "options": [
                            {
                              "text": "Yes",
                            },
                            {
                              "text": "No",
                            }
                          ]
                        }
                      ]
                    ]
                      }
                  }
  
              ]
    
                }
            return result;
          }
}

module.exports.getResponseForTrackingStatus = (data,orderId) => {
      /** if no record found */
      if(data.response === false){
          result={
              "fulfillmentMessages": [
                {
                  "payload":{
                  "richContent": [
                    [
                      {
                        "type": "description",
                        "title": "Order: "+orderId+" - "+data.product_name+"",
                        "text": [
                          "Incorrect order ID",
                          "No such order is placed",
                        ]
                      }
                    ]
                  ]
                }
                },

                {
                  "text": {
                    "text": [
                      "Is there anything else I can help you with?" 
                    ]
                  }
                }
                ,
                {
                  "payload":{
                      "richContent": [
                          [
                            {
                            "type": "chips",
                            "options": [
                                {
                                "text": "Yes",
                                },
                                {
                                "text": "No",
                                }
                            ]
                        }
                    ]
                ]
            }
        }
    ]
    
}
    return result;
}
    /** if  record found and status other than out for delivery **/
    
    /***    
         * changes made by Nikhil 
         * changed richcontent types and captured image links to fetch images;
         *  Date-05/03/2021   
     */
    
    else if(data.response == true && data.status !=="out for delivery"){
      if(data.status == "packed")
        var path = "packed.png";
        
      if(data.status == "shipped")
        var path = "shipped.png";

      if(data.status == "delivered")
        var path = "Delivered.png";

      if(data.status == "cancelled")
      var path = "cancelled.png";

      var image_url = 'https://raw.githubusercontent.com/dpmanek/images/main/'+path+'';
      result={
          "fulfillmentMessages": [
              {"payload":{
                  "richContent": [
                      [
                          {
                            "type": "image",
                            "rawUrl": data.product_image,
                            "accessibilityText": "Image"
                        },
                        {
                            "type": "accordion",
                            "title": "Order: "+orderId+" - "+data.product_name+"",
                            "subtitle": data.status,
                            "text": [
                            "Your order has been "+data.status+"",
                            ]
                        },
                        {
                            "type": "image",
                            "rawUrl": image_url,
                            "accessibilityText": "Image"
                        }
                    ]
                  ]
                }
            },

            {
            "text": {
                "text": [
                "Is there anything else I can help you with?" 
                ]
            }
        }

        /** Changes end ****/
        ,
        {"payload":{
            "richContent": [
                [
                    {
                        "type": "chips",
                        "options": [
                            {
                            "text": "Yes",
                            },
                            {
                            "text": "No",
                            }
                        ]
                    }
                  ]
                ]
            }
        }

    ]
}
        return result;
    }
//   cases for out for delivery

/** changes made by Nikhil ; changed richcontent types and captured image link to fetch images; Date-05/03/2021   ****/  
     
  else{
    if(data.status == "out for delivery"){
      var image_url = 'https://raw.githubusercontent.com/dpmanek/images/main/ood.png';
    }

    result={
        "fulfillmentMessages": [
            {
              "payload":{
              "richContent": [
                [
                  {
                    "type": "image",
                    "rawUrl": data.product_image,
                    "accessibilityText": "Image"
                  },
                  {
                    "type": "accordion",
                    "title": "Order: "+orderId+" - "+data.product_name+"",
                    "subtitle": data.status,
              
                    "text": [
                      "Your order will be delivered to you by 9PM",
                    

                    ]
                  }
                ]
              ]
            }
            },
            {
              "payload":
              {                                                                  
                  "richContent": [
                    [
                      {
                         "type": "description",
                         "title": "Delivery Agent Details:",
                          "text": [
                                    "Name : "+data.agent_name+"",
                                    "Contact Number :"+data.agent_contact+"",
                                        "",
                                        "Please ensure safety precautionary measures against COVID-19 are taken while recieving your orders",
                                        "Have a great day ahead!"
                                  ]
                       } ,
                       {
                        "type": "image",
                        "rawUrl": image_url,
                        "accessibilityText": "Image"
                      }

                    ]
                                  ]
               }

              },
            
            
            {
              "text": {
                "text": [
                  "Is there anything else I can help you with?" 
                ]
              }
            }

 /** Changes end  ****/            

            ,
            {
              "payload":{
            "richContent": [
              [
                {
                  "type": "chips",
                  "options": [
                    {
                      "text": "Yes",
                    },
                    {
                      "text": "No",
                    }
                  ]
                }
              ]
            ]
              }
          }

      ]

        }
  
      
    return result;
  }
}

module.exports.getResponseForCancelOrder = (data,orderId) => {
      /** case : Order ID Not Found ****/
      if(data.response == false){
        result={
            "fulfillmentMessages": [
                {
                  "payload":{
                  "richContent": [
                    [
                      {
                        "type": "description",
                        "title": "Order:"+orderId+"",
                        "text": [
                          "No such order has been placed.",
                        ]
                      }
                    ]
                  ]
                }
                },

                {
                  "text": {
                    "text": [
                      "Is there anything else I can help you with?" 
                    ]
                  }
                }



                ,
                {
                  "payload":{
                "richContent": [
                  [
                    {
                      "type": "chips",
                      "options": [
                        {
                          "text": "Yes",
                        },
                        {
                          "text": "No",
                        }
                      ]
                    }
                  ]
                ]
                  }
              }

          ]

            }
        return result;
      }
    /** case : delivered,out for delivery ****/
      else if(data.response == true && (data.status == "delivered" || data.status == "out for delivery" || data.status == "cancelled") ){
        
      /** 
         * changes made by Nikhil ;
         *  changed richcontent types;
         *  Date-05/03/2021   
       */  
          result={
            "fulfillmentMessages": [
                {
                  "payload":{
                  "richContent": [
                    [
                      {
                        "type": "image",
                        "rawUrl": data.product_image,
                        "accessibilityText": "Image"
                      },
                      {
                        "type": "accordion",
                        "title": "Order: "+orderId+" - "+data.product_name+"",
                        "subtitle":"Not able to cancel",
                        "text": [
                          "Since your order is already "+data.status+" , it cannot be cancelled",
                        ]
                      }
                    ]
                  ]
                }
                },

                {
                  "text": {
                    "text": [
                      "Is there anything else I can help you with?" 
                    ]
                  }
                }
                /** 
                    * changes  end  
                */
               ,
               {
                   "payload":{
                       "richContent": [
                           [
                               {
                                "type": "chips",
                                "options": [
                                    {
                                    "text": "Yes",
                                    },
                                    {
                                    "text": "No",
                                    }
                                ]
                            }
                        ]
                    ]
                  }
              }
            ]
        }
        
        return result;
    }
      /** case : Order cancellation ****/

      /** changes made by Nikhil ; changed richcontent types; Date-05/03/2021   ****/  
      else{
        result={
            "fulfillmentMessages": [
                {
                  "payload":{
                  "richContent": [
                    [
                      {
                        "type": "image",
                        "rawUrl": data.product_image,
                        "accessibilityText": "Image"
                      },
                      {
                        "type": "accordion",
                        "title": "Order: "+orderId+" - "+data.product_name+"",
                        "subtitle": "Cancelled",
                        "text": [
                          "Your order has been cancelled",
                        ]
                        
                      }
                    ]
                  ]
                }
                },

                {
                  "text": {
                    "text": [
                      "Is there anything else I can help you with?" 
                    ]
                  }
                }

       /** Changes end ****/          

                ,
                {
                  "payload":{
                "richContent": [
                  [
                    {
                      "type": "chips",
                      "options": [
                        {
                          "text": "Yes",
                        },
                        {
                          "text": "No",
                        }
                      ]
                    }
                  ]
                ]
                  }
              }

          ]

        }
        return result;
      } 
}

module.exports.getDataForRegisterComplaint = (req) => {
    for (var i in req.body.queryResult.outputContexts) {
        var str = req.body.queryResult.outputContexts[i].name;
        if (req.body.queryResult.outputContexts[i].name.includes('session_variable')){
          data = req.body.queryResult.outputContexts[i].parameters;
        }
      
    }
    let arrData = {};
    arrData.givenname = data.givenname;
    arrData.phonenumber = data.phonenumber;
    arrData.category = data.category;
    arrData.shortdescription = data.any;
    return arrData;
}
module.exports.getPriority = (category) => {
    var prior = '';

    console.log('Category from azure:::::::::::'+category)
    switch(category) {
        case "delivery":
            prior='3';
                break;
        case "quality":
            prior='3';
        break;
        case "refund":
            prior='2';
        break;
        case "return":
            prior='2';
        break;
        case "Delivery issue":
            prior='3';
                break;
        case "Quality issue":
            prior='3';
        break;
        case "Refund issue":
            prior='2';
        break;
        case "Return issue":
            prior='2';
        break;
        default:
           prior = '2';
    }
    return prior;
}

module.exports.getMsg = (arrData) => {
    var name=arrData.givenname;
    var phone=arrData.phonenumber
    var reason=arrData.shortdescription;
    var msg="reason :"+reason+" phone number:"+phone;
    return msg;
}
module.exports.getPayload = (msg,prior) => {
    let payload={
        'short_description':msg,
        'priority':prior
    };
    return payload;
}
module.exports.getResponseForRegisterComplaint = (response,arrData) => {
    result={
      "fulfillmentMessages": [
 
        {
          "payload":{
          "richContent": [
            [
              {
                "type": "info",
                "title": "Complaint Number :  " + response.number+ "" ,
                "subtitle": "Okay " + arrData.givenname+ ", your complaint has been registered successfully",
                 "image": {
                  "src": {
                    "rawUrl": "https://raw.githubusercontent.com/dpmanek/images/main/successful.jpg"
                  }
                }
              }
            ]
          ]
        }
        },
        //anything
        {
          "text": {
            "text": [
              "Is there anything else I can help you with?" 
            ]
          }
        },
        {
          "payload":{
              "richContent": [
                  [
                      {
                          "type": "chips",
                          "options": [
                            {
                                "text": "Yes",
                            },
                            {
                                "text": "No",
                            }
                        ]
                    }
                ]
            ]
          }
      }
    ]
      
    }

    return result;
}

module.exports.getResponseForTrackingComplaintStatus = (response,incidentno) => {
    if(response.length === 0){
        result={
            "fulfillmentMessages": [
                {
                  "payload":{
                  "richContent": [
                    [
                      {
                        "type": "description",
                        "title": "Complaint Number " + incidentno+ "not found",
                        "text": [
                          "",
                          "",
                          "Please try again with the correct complaint number later"
                        ]
                      }
                    ]
                  ]
                }
                },
                {
                  "text": {
                    "text": [
                      "Is there anything else I can help you with?" 
                    ]
                  }
                },
                {
                  "payload":{
                "richContent": [[
                    {
                      "type": "chips",
                      "options": [
                        {
                          "text": "Yes",
                        },
                        {
                          "text": "No",
                        }
                      ]
                    }
                ]
                ]
            }
        }
    ]
}
            
        return result;
}else{
        //track correct incident
        result={
            "fulfillmentMessages": [
                {
                  "payload":{
                  "richContent": [
                    [
                      {
                        "type": "description",
                        "title": "Complaint Number :  " + incidentno+ "",
                        "text": [
                          "",
                          "",
                          "It has been assigned to level : "+ response[0].priority+"",
                          "This issue will be resolved in next 24 hours"
                        ]
                      }
                    ]
                  ]
                }
                },

                {
                  "text": {
                    "text": [
                      "Is there anything else I can help you with?" 
                    ]
                  }
                },
                {
                  "payload":{
                "richContent": [
                  [
                    {
                      "type": "chips",
                      "options": [
                        {
                          "text": "Yes",
                        },
                        {
                          "text": "No",
                        }
                      ]
                    }
                  ]
                ]
                  }
              }

          ]
        }
            return result;
    }
}

getDynamicImagePath = (status) => {
    if(status === "out for delivery"){
        return "https://raw.githubusercontent.com/dpmanek/images/main/ood.png";
    }
    else if(status === "packed"){
        return "https://raw.githubusercontent.com/dpmanek/images/main/packed.png";
    }

    else if(status === "shipped"){
        return "https://raw.githubusercontent.com/dpmanek/images/main/shipped.png";
    }

    else if(status === "delivered"){
        return "https://raw.githubusercontent.com/dpmanek/images/main/Delivered.png";
    }

    else if(status === "cancelled"){
        return "https://raw.githubusercontent.com/dpmanek/images/main/cancelled.png";
    }
}

