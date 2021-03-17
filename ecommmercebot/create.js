const sn=require('servicenow-rest-api');

const ServiceNow=new sn('dev78226','admin','bWE9diVeg4CQ');

//ServiceNow.Authenticate();


ServiceNow.Authenticate(res=>{
    console.log(res.status);
});

//ServiceNow.getSampleData('incident',(res)=>{    
//   console.log(res);
//});

//ServiceNow.getSysId('incident','INC0010111',res=>{
//    console.log(res);
//});

var prior='';
var category="refund";
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

    default:
      // code block
  }
var name="Norma";
var phone=1425369823;
var reason="demo 1";
var msg="reason :"+reason+" phone number:"+phone;
console.log(msg);

const data={
    'short_description':msg,
    'priority':prior
};

ServiceNow.createNewTask(data,'incident',res=>{
    console.log(res);
});