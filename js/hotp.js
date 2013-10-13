
/**
 * Generates the hash (SHA1) of a byte stream.
 */
function Sha1Hash(data) {
	var value = this._calculate(data);
	
	this.val = function() {
		return value;
	}
}

Sha1Hash.prototype._rotLeft = function(num, bits) {
	var hi = num << bits;
	var lo = num >>> (32 - bits);
	return (hi | lo) & 0xFFFFFFFF;
}

Sha1Hash.prototype.toHex = function() {
	var hex = "";
	for(var i = 0; i < this.val().length; i++) {
		hex += ((this.val()[i] >>> 4) & 0xF).toString(16);
		hex += (this.val()[i] & 0xF).toString(16);
	}
	return hex;
}

Sha1Hash.prototype._calculate = function(data) {

	var h0 = 0x67452301;
	var h1 = 0xEFCDAB89;
	var h2 = 0x98BADCFE;
	var h3 = 0x10325476;
	var h4 = 0xC3D2E1F0;

	var dataWords = new Array();
	for(var i = 0; i < data.length - 3; i += 4) {
		dataWords.push((data[i] << 24) |
		               (data[i + 1] << 16) |
		               (data[i + 2] << 8) |
		               data[i + 3]);
		
		if(i + 4 >= data.length - 3) {
			var wordRest = data.length % 4;
			if(wordRest == 0) {
				dataWords.push(0x80000000);
			} else if(wordRest == 1) {
				dataWords.push((data[i + 4] << 24) |
				               0x00800000);
			} else if(wordRest == 2) {
				dataWords.push((data[i + 4] << 24) |
				               (data[i + 5] << 16) |
				               0x00008000);
			} else {
				dataWords.push((data[i + 4] << 24) |
				               (data[i + 5] << 16) |
				               (data[i + 6] << 8) |
				               0x00000080);
			}
		}
	}

	while(((dataWords.length * 32) % 512) != 448) {
		dataWords.push(0x00000000);
	}

	dataWords.push(data.length >>> 29); // (Bytes * 8) >>> 32 == Bits >>> 29
	dataWords.push((data.length * 8) & 0xFFFFFFFF);

	for(var bl = 0; bl < dataWords.length - 15; bl += 16)
	{
		var blWords = new Array();
		for(var i = 0; i < 16; i++) {
			blWords.push(dataWords[bl + i]);
		}

		for(var i = 16; i < 80; i++) {
			var newWord = this._rotLeft(blWords[i - 3] ^ blWords[i - 8] ^
			                            blWords[i - 14] ^ blWords[i - 16], 1);
			blWords.push(newWord);
		}

		var a = h0;
		var b = h1;
		var c = h2;
		var d = h3;
		var e = h4;

		for(var i = 0; i < 80; i++) {
			var f;
			var k;

			if(i < 20) {
				f = (b & c) | ((~b) & d);
				k = 0x5A827999;
			} else if(i < 40) {
				f = b ^ c ^ d;
				k = 0x6ED9EBA1;
			} else if(i < 60) {
				f = (b & c) | (b & d) | (c & d);
				k = 0x8F1BBCDC;
			} else {
				f = b ^ c ^ d;
				k = 0xCA62C1D6;
			}

			var temp = (this._rotLeft(a, 5) + f + e + k + blWords[i]) & 0xFFFFFFFF;
			e = d;
			d = c;
			c = this._rotLeft(b, 30);
			b = a;
			a = temp;
		}

		h0 = (h0 + a) & 0xFFFFFFFF;
		h1 = (h1 + b) & 0xFFFFFFFF;
		h2 = (h2 + c) & 0xFFFFFFFF;
		h3 = (h3 + d) & 0xFFFFFFFF;
		h4 = (h4 + e) & 0xFFFFFFFF;
	}

	var hashBytes = new Array();
	hashBytes.push((h0 >>> 24) & 0xFF);
	hashBytes.push((h0 >>> 16) & 0xFF);
	hashBytes.push((h0 >>> 8) & 0xFF);
	hashBytes.push(h0 & 0xFF);
	hashBytes.push((h1 >>> 24) & 0xFF);
	hashBytes.push((h1 >>> 16) & 0xFF);
	hashBytes.push((h1 >>> 8) & 0xFF);
	hashBytes.push(h1 & 0xFF);
	hashBytes.push((h2 >>> 24) & 0xFF);
	hashBytes.push((h2 >>> 16) & 0xFF);
	hashBytes.push((h2 >>> 8) & 0xFF);
	hashBytes.push(h2 & 0xFF);
	hashBytes.push((h3 >>> 24) & 0xFF);
	hashBytes.push((h3 >>> 16) & 0xFF);
	hashBytes.push((h3 >>> 8) & 0xFF);
	hashBytes.push(h3 & 0xFF);
	hashBytes.push((h4 >>> 24) & 0xFF);
	hashBytes.push((h4 >>> 16) & 0xFF);
	hashBytes.push((h4 >>> 8) & 0xFF);
	hashBytes.push(h4 & 0xFF);

	return hashBytes;
}

//function sha1sum() {
//	// Beachte: Alle Variablen sind vorzeichenlose 32-Bit-Werte und
//	// verhalten sich bei Berechnungen kongruent (≡) modulo 2^32
//	var message = encodeUtf8("Hallo Welt!");

//	// Initialisiere die Variablen:
//	//var int h0 := 0x67452301
//	//var int h1 := 0xEFCDAB89
//	//var int h2 := 0x98BADCFE
//	//var int h3 := 0x10325476
//	//var int h4 := 0xC3D2E1F0
//	var h0 = 0x67452301;
//	var h1 = 0xEFCDAB89;
//	var h2 = 0x98BADCFE;
//	var h3 = 0x10325476;
//	var h4 = 0xC3D2E1F0;

//	// Vorbereitung der Nachricht 'message':
//	//var int message_laenge := bit_length(message)
//	//erweitere message um bit "1"
//	//erweitere message um bits "0" bis Länge von message in bits ≡ 448 (mod 512)
//	//erweitere message um message_laenge als 64-Bit big-endian Integer
//	var msgLength = message.length;

//	var msgWords = new Array();
//	for(var i = 0; i < msgLength - 3; i += 4) {
//		msgWords.push((message.charCodeAt(i) << 24) |
//		              (message.charCodeAt(i + 1) << 16) |
//		              (message.charCodeAt(i + 2) << 8) |
//		              message.charCodeAt(i + 3));
//		
//		if(i + 4 >= msgLength -3) {
//			var wordRest = msgLength % 4;
//			if(wordRest == 0) {
//				msgWords.push(0x80000000);
//			} else if(wordRest == 1) {
//				msgWords.push((message.charCodeAt(i + 4) << 24) |
//				              0x00800000);
//			} else if(wordRest == 2) {
//				msgWords.push((message.charCodeAt(i + 4) << 24) |
//				              (message.charCodeAt(i + 5) << 16) |
//				              0x00008000);
//			} else {
//				msgWords.push((message.charCodeAt(i + 4) << 24) |
//				              (message.charCodeAt(i + 5) << 16) |
//				              (message.charCodeAt(i + 6) << 8) |
//				              0x00000080);
//			}
//		}
//	}

//	while(((msgWords.length * 32) % 512) != 448) {
//		msgWords.push(0x00000000);
//	}

//	msgWords.push(msgLength >>> 29); // (Bytes * 8) >>> 32 == Bits >>> 29
//	msgWords.push((msgLength * 8) & 0xFFFFFFFF);


//	// Verarbeite die Nachricht in aufeinander folgenden 512-Bit-Blöcken:
//	//für alle 512-Bit Block von message
//	//	unterteile Block in 16 32-bit big-endian Worte w(i), 0 ≤ i ≤ 15
//	for(var bl = 0; bl < msgWords.length - 15; bl += 16)
//	{
//		var blockWords = new Array();
//		for(var i = 0; i < 16; i++) {
//			blockWords.push(msgWords[bl + i]);
//		}

//		// Erweitere die 16 32-Bit-Worte auf 80 32-Bit-Worte:
//		//für alle i von 16 bis 79
//		//	w(i) := (w(i-3) xor w(i-8) xor w(i-14) xor w(i-16)) leftrotate 1
//		for(var i = 16; i < 80; i++) {
//			var newWord = rotLeft(blockWords[i - 3] ^
//			                      blockWords[i - 8] ^
//			                      blockWords[i - 14] ^
//			                      blockWords[i - 16], 1);
//			blockWords.push(newWord);
//		}

//		// Initialisiere den Hash-Wert für diesen Block:
//		//var int a := h0
//		//var int b := h1
//		//var int c := h2
//		//var int d := h3
//		//var int e := h4
//		var a = h0;
//		var b = h1;
//		var c = h2;
//		var d = h3;
//		var e = h4;

//		// Hauptschleife:
//		//für alle i von 0 bis 79
//		//	wenn 0 ≤ i ≤ 19 dann
//		//		f := (b and c) or ((not b) and d)
//		//		k := 0x5A827999
//		//	sonst wenn 20 ≤ i ≤ 39 dann
//		//		f := b xor c xor d
//		//		k := 0x6ED9EBA1
//		//	sonst wenn 40 ≤ i ≤ 59 dann
//		//		f := (b and c) or (b and d) or (c and d)
//		//		k := 0x8F1BBCDC
//		//	sonst wenn 60 ≤ i ≤ 79 dann
//		//		f := b xor c xor d
//		//		k := 0xCA62C1D6
//		//	wenn_ende
//		for(var i = 0; i < 80; i++) {
//			var f = 0;
//			var k = 0;

//			if(i < 20) {
//				f = (b & c) | ((~b) & d);
//				k = 0x5A827999;
//			} else if(i < 40) {
//				f = b ^ c ^ d;
//				k = 0x6ED9EBA1;
//			} else if(i < 60) {
//				f = (b & c) | (b & d) | (c & d);
//				k = 0x8F1BBCDC;
//			} else {
//				f = b ^ c ^ d;
//				k = 0xCA62C1D6;
//			}

//			//temp := (a leftrotate 5) + f + e + k + w(i)
//			//e := d
//			//d := c
//			//c := b leftrotate 30
//			//b := a
//			//a := temp
//			var rted = leftRotateWord(a, 5);
//			var temp = leftRotateWord(a, 5) + f + e + k + blockWords[i];
//			e = d;
//			d = c;
//			c = leftRotateWord(b, 30);
//			b = a;
//			a = temp & 0xFFFFFFFF;
//		}

//		// Addiere den Hash-Wert des Blocks zur Summe der vorherigen Hashes:
//		//h0 := h0 + a
//		//h1 := h1 + b
//		//h2 := h2 + c
//		//h3 := h3 + d
//		//h4 := h4 + e
//		h0 += a;
//		h0 &= 0xFFFFFFFF;
//		h1 += b;
//		h1 &= 0xFFFFFFFF;
//		h2 += c;
//		h2 &= 0xFFFFFFFF;
//		h3 += d;
//		h3 &= 0xFFFFFFFF;
//		h4 += e;
//		h4 &= 0xFFFFFFFF;
//	}

//	//digest = hash = h0 append h1 append h2 append h3 append h4 //(Darstellung als big-endian)
//	return wordToHex(h0) + wordToHex(h1) + wordToHex(h2) + wordToHex(h3) + wordToHex(h4);
//}

function HMac(key, data) {
	var hash = this._calculate(key, data);
	
	this.val = function() {
		return hash.val();
	}

	this.toHex = function() {
		return hash.toHex();
	}
}

HMac.prototype._calculate = function(key, data) {
	var blLength = 64;
	var hashLength = 20;

	var ipad = new Array();
	for(var i = 0; i < blLength; i++) {
		ipad.push(0x36);
	}

	var opad = new Array();
	for(var i = 0; i < blLength; i++) {
		opad.push(0x5C);
	}

	while(key.length < blLength) {
		key.push(0x00);
	}

	var iBytes = new Array();
	for(var i = 0; i < blLength; i++) {
		iBytes.push(key[i] ^ ipad[i]);
	}
	for(var i = 0; i < data.length; i++) {
		iBytes.push(data[i]);
	}

	var iHash = new Sha1Hash(iBytes);
	var iHashBytes = iHash.val();
	
	var oBytes = new Array();
	for(var i = 0; i < blLength; i++) {
		oBytes.push(key[i] ^ opad[i]);
	}
	for(var i = 0; i < iHashBytes.length; i++) {
		oBytes.push(iHashBytes[i]);
	}

	var oHash = new Sha1Hash(oBytes);

	return oHash;
}

function HOTP(key, counter, digits, algorithm) {
	var _digits = 6;
	var _algorithm = "SHA1";
	if(digits == 7 || digits == 8) _digits = digits;
	if(algorithm == "MD5" || algorithm == "SHA256" || algorithm == "SHA512") _algorithm = algorithm;

	var value = this._calculate(key, counter, _digits, _algorithm);

	this.val = function() {
		return value;
	}
}

HOTP.prototype._calculate = function(key, counter, digits, algorithm) {
	var hash = new HMac(key, counter);
	
	var offset = hash.val()[19] & 0xF;
	var word = (hash.val()[offset] & 0x7F) << 24;
	word |= hash.val()[offset + 1] << 16;
	word |= hash.val()[offset + 2] << 8;
	word |= hash.val()[offset + 3];

	var hotp = (word % Math.pow(10, 6)).toString();
	while(hotp.length < 6) {
		hotp = '0' + hotp;
	}
	return hotp;
}

function TOTP(key, digits, algorithm, period) {
	var _period = 30;
	if(period > 0) _period = period;

	var value = this._calculate(key, digits, algorithm, _period);

	this.val = function() {
		return value;
	}
}

TOTP.prototype._calculate = function(key, digits, algorithm, period) {
	var counter = Math.floor((Math.floor((new Date()).getTime() / 1000)) / period);

	var counterBytes = new Array();
	for(var i = 7; i >= 0; i--) {
		counterBytes.push(Math.floor(counter / Math.pow(2, i * 8)) & 0xFF);
	}

	var hotp = new HOTP(key, counterBytes, digits, algorithm);
	return hotp.val();
}

