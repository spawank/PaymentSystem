const express = require("express")
const router = express.Router();
var HashMap = require('hashmap');
var transactions= null;
var parentMapping = null;


/***------------- create transaction API --------------***/
/* Complexity. Time: O(1), Space: O(2n) (Using two hashMap(transactions & parentMapping) to store data in memory) */

createTransaction = (req, res) => {
    var error = validateRequest(req);
    if(error != null) return res.status(400).send(error);
    
    this.transactions = this.transactions == null ? new HashMap : this.transactions;
    var txn = {
        "id"     : req.params.id,
        "amount" : req.body.amount,
        "type"   : req.body.type,
        "parent_id" : req.body.parent_id
    }
    this.transactions.set(req.params.id, txn);
    updateParentMapping(txn);
    return res.status(200).send(txn);
}

updateParentMapping = (txn) => {
    this.parentMapping = this.parentMapping == null ? new HashMap : this.parentMapping;
    if(txn.parent_id != null) {
        var childList = this.parentMapping.has(txn.parent_id) ? this.parentMapping.get(txn.parent_id) : [];
        childList.push(txn.id)
        this.parentMapping.set(txn.parent_id, childList);
    }
}


/***----------- get details by tranaction id API ------------***/
/* Complexity. Time: O(1), Space: O(2n) (Using same two hashMap(transactions & parentMapping) for this) */

getPaymentById = (req, res) => {
    if(this.transactions != null && this.transactions.has(req.params.id)) {
        return res.status(200).send(this.transactions.get(req.params.id));
    } else {
        return res.status(400).send({"error" : "Bad Request", "message" : "Transsaction id doesn't exist"});
    }
}


/***----------- list tranactions by given type ------------***/
/* Complexity. Time: O(n)(traversing hashmap by n to check types), Space: O(2n) (Using same two hashMap(transactions & parentMapping) for this) */

getTransactionsByType = (req, res) => {
    var idList = [];
    if(this.transactions != null) {
        this.transactions.forEach(function(value, key) {
            if (value.type == req.params.type)  {
               idList.push(key);
            }
        })
    }
    return res.status(200).send(idList);
}


/***----------- Sum of all tranactions for given id ------------***/
/* Complexity. Time: O(n^2)(it can be n^2 in wrost case), Space: O(2n) (Using same two hashMap(transactions & parentMapping) and 
one extra stack to traverse transitively linked transaction) */

sumOfAllTransactions = (req, res) => {
    var sum = 0;
    var stack = [];
    stack.push(req.params.id);
    while(stack.length != 0) {
        var id = stack.pop();
        var txn = this.transactions.get(id);
        sum = sum + txn.amount;
        childList = this.parentMapping.has(Number(id)) ? this.parentMapping.get(Number(id)) : [];
        for(i=0; i < childList.length; i++) {
           stack.push(childList[i]);
        }
    }
    return res.status(200).send({"sum" : sum});
}

validateRequest = (req) => {
    if(this.transactions != null && this.transactions.has(req.params.id)) {
        return {"error" : "Bad Request", "message" : "Duplicate Transaction id, Same id is already present"}
    }
    if(req.body.amount == null || isNaN(req.body.amount)) {
        return {"error" : "Bad Request", "message" : "Invalid amount"}
    }
    if(req.body.parent_id != null) {
        if (this.transactions == null || !this.transactions.has(req.body.parent_id.toString()))
            return {"error" : "Bad Request", "message" : "This parent_id doesn't exist"}
    }
    if(isNaN(req.params.id)) {
        return {"error" : "Bad Request", "message" : "Invalid tansaction id"}
    }
}

exports.getPaymentById = getPaymentById;
exports.createTransaction = createTransaction;
exports.getTransactionsByType = getTransactionsByType;
exports.sumOfAllTransactions = sumOfAllTransactions;