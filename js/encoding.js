
function encodeUtf8(raw) {
	var utf8String = "";
	raw = raw.replace(/\r\n/g, "\n");
	
	for(var i = 0; i < raw.length; i++) {
		var char = raw.charCodeAt(i);
		
		if(char < 128) {
			utf8String += String.fromCharCode(char);
		} else if (char >= 128 && char < 2048) {
			utf8String += String.fromCharCode((char >> 6) | 0xC0);
			utf8String += String.fromCharCode((char & 0x3F) | 0x80);
		} else {
			utf8String += String.fromCharCode((char >> 12) | 0xE0);
			utf8String += String.fromCharCode(((char >> 6) & 0x3F) | 0x80);
			utf8String += String.fromCharCode((char & 0x3F) | 0x80);
		}
	}

	return utf8String;
}

function decodeBase32(base32String) {

	function charToNumber(char) {
		switch(char) {
			case 'A': return 0;
			case 'B': return 1;
			case 'C': return 2;
			case 'D': return 3;
			case 'E': return 4;
			case 'F': return 5;
			case 'G': return 6;
			case 'H': return 7;
			case 'I': return 8;
			case 'J': return 9;
			case 'K': return 10;
			case 'L': return 11;
			case 'M': return 12;
			case 'N': return 13;
			case 'O': return 14;
			case 'P': return 15;
			case 'Q': return 16;
			case 'R': return 17;
			case 'S': return 18;
			case 'T': return 19;
			case 'U': return 20;
			case 'V': return 21;
			case 'W': return 22;
			case 'X': return 23;
			case 'Y': return 24;
			case 'Z': return 25;
			case '2': return 26;
			case '3': return 27;
			case '4': return 28;
			case '5': return 29;
			case '6': return 30;
			case '7': return 31;
			case '=': return 0;
		}
	}

	var byte0;
	var byte1;
	var byte2;
	var byte3;
	var byte4;
	var bytes = new Array();
	for(var i = 0; i < base32String.length; i += 8) {
		byte0 = (charToNumber(base32String.charAt(i)) << 3) & 0xFF;
		byte0 |= (charToNumber(base32String.charAt(i + 1)) >>> 2) & 0xFF;
		byte1 = (charToNumber(base32String.charAt(i + 1)) << 6) & 0xFF;
		byte1 |= (charToNumber(base32String.charAt(i + 2)) << 1) & 0xFF;
		byte1 |= (charToNumber(base32String.charAt(i + 3)) >>> 4) & 0xFF;
		byte2 = (charToNumber(base32String.charAt(i + 3)) << 4) & 0xFF;
		byte2 |= (charToNumber(base32String.charAt(i + 4)) >>> 1) & 0xFF;
		byte3 = (charToNumber(base32String.charAt(i + 4)) << 7) & 0xFF;
		byte3 |= (charToNumber(base32String.charAt(i + 5)) << 2) & 0xFF;
		byte3 |= (charToNumber(base32String.charAt(i + 6)) >>> 3) & 0xFF;
		byte4 = (charToNumber(base32String.charAt(i + 6)) << 5) & 0xFF;
		byte4 |= charToNumber(base32String.charAt(i + 7)) & 0xFF;
		
		bytes.push(byte0);
		if(base32String.charAt(i + 2) != '=') bytes.push(byte1);
		if(base32String.charAt(i + 4) != '=') bytes.push(byte2);
		if(base32String.charAt(i + 5) != '=') bytes.push(byte3);
		if(base32String.charAt(i + 7) != '=') bytes.push(byte4);
	}
	
	return bytes;
}

function toBytes(str) {
	var strBytes = new Array();
	for(var i = 0; i < str.length; i++) {
		strBytes.push(str.charCodeAt(i));
	}
	return strBytes;
}

function getUrlParameter(name) {
	var value = null;
	var parameters = window.location.search.substring(1).split('&');
	for(var i = 0; i < parameters.length; i++) {
		var parameter = parameters[i].split('=');
		if(parameter[0] == name) {
			value = parameter[1];
		}
	}
	return value;
}
