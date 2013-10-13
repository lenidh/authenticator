
function Account(obj) {
	for (var prop in obj) this[prop] = obj[prop];
}

Account.prototype.type = undefined;

Account.prototype.label = undefined;

Account.prototype.secret = undefined;

Account.prototype.issuer = undefined;

Account.prototype.algorithm = "SHA1";

Account.prototype.digits = 6;

Account.prototype.counter = undefined;

Account.prototype.period = 30;

function saveAccounts(accounts) {
	localStorage.setItem("accounts", JSON.stringify(accounts));
}

function loadAccounts() {
	var json = localStorage.getItem("accounts");
	var objArray = JSON.parse(json);

	var accountsArray = new Array();
	for(var i = 0; i < objArray.length; i++) {
		accountsArray.push(new Account(objArray[i]));
	}

	return accountsArray;
}

