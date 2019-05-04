/*!
 * g711
 * Copyright(c) 2011 João Martins <madjackoo@gmail.com>
 * MIT Licensed
 */
//(function (exports) {
"use strict";
var G711 = {};
G711.BIAS = 0x84;
G711.CLIP = 32635;
G711.tables = {

    alaw: {
        compress: [
            1, 1, 2, 2, 3, 3, 3, 3,
            4, 4, 4, 4, 4, 4, 4, 4,
            5, 5, 5, 5, 5, 5, 5, 5,
            5, 5, 5, 5, 5, 5, 5, 5,
            6, 6, 6, 6, 6, 6, 6, 6,
            6, 6, 6, 6, 6, 6, 6, 6,
            6, 6, 6, 6, 6, 6, 6, 6,
            6, 6, 6, 6, 6, 6, 6, 6,
            7, 7, 7, 7, 7, 7, 7, 7,
            7, 7, 7, 7, 7, 7, 7, 7,
            7, 7, 7, 7, 7, 7, 7, 7,
            7, 7, 7, 7, 7, 7, 7, 7,
            7, 7, 7, 7, 7, 7, 7, 7,
            7, 7, 7, 7, 7, 7, 7, 7,
            7, 7, 7, 7, 7, 7, 7, 7,
            7, 7, 7, 7, 7, 7, 7, 7
        ],

        decompress: [
            -5504, -5248, -6016, -5760, -4480, -4224, -4992, -4736,
            -7552, -7296, -8064, -7808, -6528, -6272, -7040, -6784,
            -2752, -2624, -3008, -2880, -2240, -2112, -2496, -2368,
            -3776, -3648, -4032, -3904, -3264, -3136, -3520, -3392,
            -22016, -20992, -24064, -23040, -17920, -16896, -19968, -18944,
            -30208, -29184, -32256, -31232, -26112, -25088, -28160, -27136,
            -11008, -10496, -12032, -11520, -8960, -8448, -9984, -9472,
            -15104, -14592, -16128, -15616, -13056, -12544, -14080, -13568,
            -344, -328, -376, -360, -280, -264, -312, -296,
            -472, -456, -504, -488, -408, -392, -440, -424,
            -88, -72, -120, -104, -24, -8, -56, -40,
            -216, -200, -248, -232, -152, -136, -184, -168,
            -1376, -1312, -1504, -1440, -1120, -1056, -1248, -1184,
            -1888, -1824, -2016, -1952, -1632, -1568, -1760, -1696,
            -688, -656, -752, -720, -560, -528, -624, -592,
            -944, -912, -1008, -976, -816, -784, -880, -848,
            5504, 5248, 6016, 5760, 4480, 4224, 4992, 4736,
            7552, 7296, 8064, 7808, 6528, 6272, 7040, 6784,
            2752, 2624, 3008, 2880, 2240, 2112, 2496, 2368,
            3776, 3648, 4032, 3904, 3264, 3136, 3520, 3392,
            22016, 20992, 24064, 23040, 17920, 16896, 19968, 18944,
            30208, 29184, 32256, 31232, 26112, 25088, 28160, 27136,
            11008, 10496, 12032, 11520, 8960, 8448, 9984, 9472,
            15104, 14592, 16128, 15616, 13056, 12544, 14080, 13568,
            344, 328, 376, 360, 280, 264, 312, 296,
            472, 456, 504, 488, 408, 392, 440, 424,
            88, 72, 120, 104, 24, 8, 56, 40,
            216, 200, 248, 232, 152, 136, 184, 168,
            1376, 1312, 1504, 1440, 1120, 1056, 1248, 1184,
            1888, 1824, 2016, 1952, 1632, 1568, 1760, 1696,
            688, 656, 752, 720, 560, 528, 624, 592,
            944, 912, 1008, 976, 816, 784, 880, 848
        ]
    }
};

/**
 * Encode
 */
G711.encode = function (samples, options) {
    options = options || {};

    if (samples.constructor == Array) {
        samples.byteLength = samples.length * 2;
    }
    var buffer = new ArrayBuffer(samples.byteLength / 2)
        , encoded = new Int8Array(buffer);

    for (var i = 0; i < samples.byteLength / 2; i++) {

        var sbuffer = new ArrayBuffer(2)
            , bbuffer = new ArrayBuffer(1)

            , _short = new Int16Array(sbuffer)
            , _byte = new Int8Array(bbuffer);

        var sign, exponent, mantissa, s;

        sign = ((~samples[i]) >> 8) & 0x80;
        if (!(sign == 0x80)) {
            _short[0] = -samples[i];
            samples[i] = _short[0];
        }

        if (samples[i] > G711.CLIP) {
            samples[i] = G711.CLIP;
        }

        if (samples[i] >= 256) {
            exponent = G711.tables.alaw.compress[(samples[i] >> 8) & 0x7F];
            mantissa = (samples[i] >> (exponent + 3)) & 0x0F;
            _byte[0] = (exponent << 4) | mantissa;
        } else {
            _byte[0] = samples[i] >> 4;
        }

        _byte[0] ^= (sign ^ 0x55);

        encoded[i] = _byte[0];
    }

    return encoded;
};

G711.decode = function (encoded, options) {
    options = options || {};
    if (typeof encoded.byteLength == 'undefined') {
        encoded.byteLength = encoded.length;
    }
    var floating_point = !!options["floating_point"]
        , buffer = new ArrayBuffer(encoded.byteLength * (!floating_point ? 2 : 4))
        , decoded = new Float32Array(buffer)
        , tmp;

    for (var i = 0; i < encoded.byteLength; i++) {

        var buffer = new ArrayBuffer(2)
            , _short = new Int8Array(buffer);
        var s = G711.tables.alaw.decompress[encoded[i] & 0xff];
        _short[0] = s;
        _short[1] = (s >> 8);
        tmp = new Int16Array(_short.buffer)[0];

        decoded[i] = (tmp / 32768);
    }

    return decoded;
};

/**
 * Library version.
 */
// exports.G711 = G711;
// exports.version = '0.0.2';
//}(typeof(exports) !== "undefined" ? module.exports : window));
