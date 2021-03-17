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



const fields=[
    'number',
    'short_description',
    'assignment_group',
    'priority'
];

const filters=[
    'number=INC0010024'
];

ServiceNow.getTableData(fields,filters,'incident',function(res){
    console.log(res);
    console.log(res.status)
});