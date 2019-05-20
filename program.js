"use strict";

//The set of regular expressions
let purchaseRegExp = /^purchase\s(\d\d\d\d)-(\d\d)-(\d\d)\s([0-9\.]{1,})\s([A-Z]{3})\s([a-zA-Z0-9_\s\D]{1,})/
let purchase = /^purchase/
let all = /^all/
let cl = /^clear/
let rep = /^report/
let clear = /^clear\s(\d\d\d\d-\d\d-\d\d)/
let report = /^report\s(\d\d\d\d)\s([A-Z]{3})/

//function for creating new object
function IncomeObject (name,year,month,day,amount,currency){
	this.year = year;
	this.month = month;
	this.day = day;
	this.amount = amount;
	this.currency = currency;
	this.name = name;

	this.PrintInfo = function(){
		return (this.name+' ' + this.amount+' '+ this.currency);
	}

	this.PrintData = function(){
		let mon = this.month.toString();
		let dd = this.day.toString();
		if (this.month<10){
			mon = '0'+ this.month.toString();
		}
		if (this.day<10){
			dd = dd + '0'+ this.day.toString();
		}
		return (this.year.toString()+'-'+mon+'-'+dd);
	}
}

// array which will contain inputted objects
let arrIncomeObjects = []; 

//create new item from purchase request
function CreateObject(MainStr){
	let objectInfo = MainStr.match(purchaseRegExp);
	if (parseInt(objectInfo[2])<0||parseInt(objectInfo[2])>12||parseInt(objectInfo[3])>31||parseInt(objectInfo[3])<0) {
		alert('Wrong month or day number')
	} else {
		let newIncome = new IncomeObject(objectInfo[6],parseInt(objectInfo[1]),parseInt(objectInfo[2]),parseInt(objectInfo[3]),parseFloat(objectInfo[4]),objectInfo[5]);
		return newIncome;
	}
}

//swaping x and y elements in arr array
let swapArrayElements = function (arr, x, y) {
	if (arr.length === 1) return arr;
	arr.splice(y, 2, arr[x], arr[y]);
	return arr;
};

//sorting objects in array arr with date
function SortObjects(arr){
	let N = arr.length-1;
	for (let j = N; j > 0; j--){
		if (arr[j].year < arr[j-1].year){
			swapArrayElements(arr,j,j-1);
		} else {
			if (arr[j].year == arr[j-1].year){
				if (arr[j].month < arr[j-1].month) {
					swapArrayElements(arr,j,j-1);	
				} else {
					if (arr[j].month == arr[j-1].month){
						if (arr[j].day < arr[j-1].day) {
							swapArrayElements(arr,j,j-1);
						} else {break;}
					}
				}
			}
		}
	}
	return arr;
}

//output all information
function PrintAll(arr){
	let allInfo = '';
	let tempData ='';
	for(let i=0;i < arr.length;i++) {
		if (arr[i].PrintData() != tempData) {
			tempData = arr[i].PrintData();
			allInfo = allInfo + '\n' + tempData +'\n';			
		}
		allInfo = allInfo + arr[i].PrintInfo()+ '\n';
	}
	alert(allInfo);
}

//removing elements with date = cData in array arr
function ClearDate(arr,cData){
	let count = true;
	for(let i=0;i < arr.length;i++) {
		if (arr[i].PrintData() == cData) {
			arr.splice(i, 1);
			i=i-1;	
			count = false;			
		}
	}
	if (count) {
		alert('There are no entries for this date');
	}
	return arr;
}

// calculating total income in "y" year in "cur" currency
function TotalIncome(arr,y,cur) {
	let req = new XMLHttpRequest();
	let URL = 'http://data.fixer.io/api/latest?access_key=a3f90649e2ff8edc6daab353acdd8c0a';
	let curInfo;
	let money = 0.0;
	req.open('GET', URL, false);
	req.onload = function() {
  		if (req.status >= 200 && req.status < 400) {
    		curInfo = JSON.parse(req.responseText);
    		for (let i = 0; i < arr.length; i++) {
  				money = money + arr[i].amount*curInfo.rates[cur]/curInfo.rates[arr[i].currency];
  			}
  			alert(money.toString() + ' ' + cur);
    	} else {
    		alert('error in request');
  		}
  	};
	req.send();
}

//main dialoge where program check the request and output appropriate information
while (true) {
	let MainStr = prompt("Enter your request. The availeble are:\n\npurchase\nall\nclear\nreport","");
	//exit from program
	if (MainStr == "exit") {break;}
	//print all information
	if (all.test(MainStr)) {
		PrintAll(arrIncomeObjects);
	}
	//delete items with certain date
	if (cl.test(MainStr)) {
		if (clear.test(MainStr)) {
			let cData = MainStr.match(clear);
			ClearDate(arrIncomeObjects,cData[1]);
			PrintAll(arrIncomeObjects);
		} else {
			alert('Something wrong. Try to use next format of clear request\n\nclear YYYY-MM-DD\n\nYYYY - year\nMM - month\nDD - day');
		}
	}
	//create new income item
	if (purchase.test(MainStr)){
		if (purchaseRegExp.test(MainStr)){
			let newIncome = CreateObject(MainStr);
			arrIncomeObjects.push(newIncome);
			SortObjects(arrIncomeObjects);
			PrintAll(arrIncomeObjects);
		} else {
			alert('Something wrong. Try to use next format of purchase request\n\npurchase YYYY-MM-DD AA UUU NNNN\n\nYYYY - year\nMM - month\nDD - day\nAA - price\nUUU - currency\nNNNN - item name')
		}
	}
	// report the total income in certain year in certain currency
	if (rep.test(MainStr)){
		if (report.test(MainStr)) {
			let reportInfo = MainStr.match(report);
			TotalIncome(arrIncomeObjects,parseInt(reportInfo[1]),reportInfo[2]);
		} else {
			alert('Something wrong. Try to use next format of report request\n\nreport YYYY UUU\n\nYYYY - year\nUUU - currency');
		}
	}
}