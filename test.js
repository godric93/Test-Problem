"use strict";

function isEqual(a,b){
	if (a==b){
		return 'All is fine\n';
	} else {
		return 'Something wrong\n';
	}
}

//The set of test input requests
let item1 = "purchase 2019-04-26 1 PLN item1";
let item2 = "purchase 2019-10-26 2 USD item2";
let item3 = "purchase 2019-09-26 3 UAH item3";
let item4 = "purchase 2019-10-16 4 PLN item4";
let item5 = "purchase 2018-12-26 5 CAD item5";

/*//The set of regular expressions
let purchaseRegExp = /^purchase\s(\d\d\d\d)-(\d\d)-(\d\d)\s([0-9\.]{1,})\s([A-Z]{3})\s([a-zA-Z0-9_\s\D]{1,})/;
let purchase = /^purchase/;
let all = /^all/;
let cl = /^clear/;
let rep = /^report/;
let clear = /^clear\s(\d\d\d\d-\d\d-\d\d)/;
let report = /^report\s(\d\d\d\d)\s([A-Z]{3})/;*/

//test report variable
let testAlert = "";

//The set of test input objects
let object1 = CreateObject(item1);
let object2 = CreateObject(item2);
let object3 = CreateObject(item3);
let object4 = CreateObject(item4);
let object5 = CreateObject(item5);
let arr = [object2,object3,object4];
//test of CreateObject function 
function checkDataCreation(){
	testAlert += "\nappropriate creation checking\n";
	testAlert += isEqual(object2.amount,2);
	testAlert += isEqual(object1.name,"item1");
}
//test of swapArrayElements function
function checkSwaping(){
	let a = arr[1].amount;
	let b = arr[2].amount;
	swapArrayElements(arr,2,1);
	testAlert += "\nappropriate swap checking\n";
	testAlert += isEqual(arr[1].amount,b);
	testAlert += isEqual(arr[2].amount,a);
}
//test of SortObjects function
function checkSort(){
	arr.push(object5);
	SortObjects(arr);
	testAlert += "\nappropriate sоrt checking\n";
	testAlert += isEqual(arr[0].amount,5);
}
//test printing functions
function checkPrint(){
	testAlert += "\nappropriate print checking\n";
	testAlert += isEqual(object3.PrintInfo(),"item3 3 UAH");
	testAlert += isEqual(object4.PrintData(),"2019-10-16");
}
//test ClearDate functions
function checkClear(){
	let arr = [object2,object3,object4];
	ClearDate(arr,"2019-09-26");
	testAlert += "\nappropriate clrear data checking\n";
	testAlert += isEqual(arr[0].amount,2);
	testAlert += isEqual(arr[1].amount,4);
}

checkDataCreation();
checkSwaping();
checkSort();
checkPrint();
checkClear();
alert(testAlert);
