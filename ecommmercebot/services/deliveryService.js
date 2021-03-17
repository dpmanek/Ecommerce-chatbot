const db = require("../config/connect"); 
module.exports.getDeliveryDetails = (orderId) => {
    return new Promise((resolve,reject) => {
        if(orderId !==""){
            let arrData = {};
            let sql = "select delivery.agent_name,delivery.agent_contact from delivery inner join orders on orders.order_id = delivery.order_id where delivery.order_id =  '"+orderId+"' and status = 'out for delivery';";
            db.connection.query(sql,async function(err, res, fields){
                if(err)
                    throw err;
                 if(res.length > 0 ){
                    arrData.agent_name = res[0].agent_name;
                    arrData.agent_contact = res[0].agent_contact;
                    let msg = "You order <"+orderId+"> will be delivered to you by 9 pm. Your delivery agent details are : <"+arrData.agent_name+"> - <"+arrData.agent_contact+">";
                    resolve(msg);
                 }   
            });
        }
    });
    
}