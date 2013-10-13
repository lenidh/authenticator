
var accounts;
var tokenHolder = [];
var indicatorHolder = [];
var tokenInterval = 0;
var indicatorInterval = 0;

function initTokenList() {
	accounts = loadAccounts();
	tokenHolder = [];
	indicatorHolder = [];
	clearInterval(tokenInterval);
	clearInterval(indicatorInterval);

	var tokenList = document.getElementById("token-list");
	var tokenListHtml = "";
	for(var i = 0; i < accounts.length; i++) {
		tokenListHtml += "<div class=\"token-item\">";
		tokenListHtml += "<p class=\"issuer\">" + accounts[i].issuer + "</p>";
		tokenListHtml += "<p id=\"token" + i + "\" class=\"token\"></p>";
		tokenListHtml += "<canvas id=\"indicator" + i + "\" class=\"indicator\" width=\"50px\" height=\"50px\"></canvas>";
		tokenListHtml += "<p class=\"label small\">" + accounts[i].label + "</p>";
		tokenListHtml += "</div>";
	}
	tokenList.innerHTML = tokenListHtml;

	tokenInterval = setInterval(refreshTokens, 1000);
	indicatorInterval = setInterval(refreshIndicators, 10);
}

function refreshTokens() {
	for(var i = 0; i < accounts.length; i++) {
		if(tokenHolder[i] == undefined) tokenHolder[i] = document.getElementById("token" + i);
		var totp = new TOTP(decodeBase32(accounts[i].secret));
		tokenHolder[i].innerHTML = totp.val();
	}
}

function refreshIndicators() {
	for(var i = 0; i < accounts.length; i++) {
		var period = accounts[i].period * 100;
		var curSeconds = Math.floor((new Date()).getTime() / 10);
		var periodRest = curSeconds % period;
		var indicatorValue = 1 / period * periodRest;
		drawIndicator(i, indicatorValue);
	}
}

function drawIndicator(i, value) {
	if(indicatorHolder[i] == undefined) indicatorHolder[i] = document.getElementById("indicator" + i);

	if(indicatorHolder[i] && indicatorHolder[i].getContext) {
		var context = indicatorHolder[i].getContext("2d");
		if(context) {
			context.clearRect(0, 0, indicatorHolder[i].width, indicatorHolder[i].height)

			context.strokeStyle = "#749CB2";
			context.fillStyle = "#C4D6E0";
			context.lineWidth = 5;

			var xCenter = Math.floor(indicatorHolder[i].width / 2);
			var yCenter = Math.floor(indicatorHolder[i].height / 2);
			var radius = ((xCenter < yCenter) ? xCenter : yCenter) - context.lineWidth;
			var end = 2 * value - 0.5;

			context.beginPath();
			context.arc(xCenter, yCenter, radius, 1.5 * Math.PI, end * Math.PI, true);
			context.lineTo(xCenter, yCenter);
			context.closePath();
			//context.stroke();
			context.fill();
		}
	}
}

