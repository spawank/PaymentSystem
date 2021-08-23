var readline = require('readline-sync');
const axios = require('axios')

const paymentRouter = require("../Services/Payment");

testAPIs = async () => {
   console.log("-----------Payment System-----------");
   var command = readline.question("Enter any one action from this list(CREATE, GET, LIST, SUM) : ");
   switch(command) {
      case "CREATE" :
         console.log("Enter required inputs to create a new transaction");
         var id = readline.question("Enter id : ");
         var amount = readline.question("Enter amount : ");
         var type = readline.question("Enter transaction type : ");
         var decision = readline.question("Do you want to link this txn with parentId (Enter Y/N): ");
         var parentId = null;
         if (decision == "Y") {parentId = Number(readline.question("Enter parent id : "));}
         await callCreateAPI(id, Number(amount), type, parentId);
         break;
      case "GET" :
         console.log("Enter required inputs to get transaction details");
         var id = readline.question("Enter id : ");
         await callGetAPI(id);
         break;
      case "LIST" :
         console.log("Enter required inputs to get list of transaction ids by type");
         var type = readline.question("Enter type of transactions : ");
         await callListTransactionAPI(type);
         break;
      case "SUM" :
         console.log("Enter required inputs to get sum of all linked transactions with given one");
         var id = readline.question("Enter id : ");
         await callComputeSumAPI(id);
         break;
      default:
         console.log("Please enter valid command");
   }
   var d = readline.question("Continue or Exit (Enter C/E): ");
   if(d == "C") testAPIs();
}

const callCreateAPI = async (id, amount, type, parentId) => {
   try {
      let response = await (axios
         .post('http://localhost:8081/transactionservice/transaction/' + id, {
            "amount" : amount,
            "type" : type,
            "parent_id" : parentId
         }))
      console.log(`statusCode: ${response.status}`)
      console.log("Response :", response.data);
   }
   catch(e) {
      console.error("staus code: ", e.response.status);
      console.error("error message: ", e.response.data);
   }
}

const callGetAPI = async (id) => {
   try {
      let response = await (axios
         .get('http://localhost:8081/transactionservice/transaction/' + id))
      console.log(`statusCode: ${response.status}`)
      console.log("Response :", response.data);
   }
   catch(e) {
      console.error("staus code: ", e.response.status);
      console.error("error message: ", e.response.data);
   }
}

const callListTransactionAPI = async (type) => {
   try {
      let response = await (axios
         .get('http://localhost:8081/transactionservice/types/' + type))
      console.log(`statusCode: ${response.status}`)
      console.log("Response :", response.data);
   }
   catch(e) {
      console.error("staus code: ", e.response.status);
      console.error("error message: ", e.response.data);
   }
}

const callComputeSumAPI = async (id) => {
   try {
      let response = await (axios
         .get('http://localhost:8081/transactionservice/sum/' + id))
      console.log(`statusCode: ${response.status}`)
      console.log("Response :", response.data);
   }
   catch(e) {
      console.error("staus code: ", e.response.status);
      console.error("error message: ", e.response.data);
   }
}

testAPIs();