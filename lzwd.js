// 
// LZW Decompress
//

function Base64Decoder( text )
{
    var index = 0;
    var bits = 0;
    var b = 
    [   
        -9,-9,-9,-9,-9,-9,-9,-9,-9,                 // Decimal  0 -  8
        -5,-5,                                      // Whitespace: Tab and Linefeed
        -9,-9,                                      // Decimal 11 - 12
        -5,                                         // Whitespace: Carriage Return
        -9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,     // Decimal 14 - 26
        -9,-9,-9,-9,-9,                             // Decimal 27 - 31
        -5,                                         // Whitespace: Space
        -9,-9,-9,-9,-9,-9,-9,-9,-9,-9,              // Decimal 33 - 42
        62,                                         // Plus sign at decimal 43
        -9,-9,-9,                                   // Decimal 44 - 46
        63,                                         // Slash at decimal 47
        52,53,54,55,56,57,58,59,60,61,              // Numbers zero through nine
        -9,-9,-9,                                   // Decimal 58 - 60
        -1,                                         // Equals sign at decimal 61
        -9,-9,-9,                                      // Decimal 62 - 64
        0,1,2,3,4,5,6,7,8,9,10,11,12,13,            // Letters 'A' through 'N'
        14,15,16,17,18,19,20,21,22,23,24,25,        // Letters 'O' through 'Z'
        -9,-9,-9,-9,-9,-9,                          // Decimal 91 - 96
        26,27,28,29,30,31,32,33,34,35,36,37,38,     // Letters 'a' through 'm'
        39,40,41,42,43,44,45,46,47,48,49,50,51,     // Letters 'n' through 'z'
        -9,-9,-9,-9                                 // Decimal 123 - 126
        /*,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,     // Decimal 127 - 139
        -9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,     // Decimal 140 - 152
        -9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,     // Decimal 153 - 165
        -9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,     // Decimal 166 - 178
        -9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,     // Decimal 179 - 191
        -9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,     // Decimal 192 - 204
        -9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,     // Decimal 205 - 217
        -9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,     // Decimal 218 - 230
        -9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,     // Decimal 231 - 243
        -9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9,-9         // Decimal 244 - 255 */
    ];

    
    this.getBits = function( n )
    {
        if( index >= text.length )
            return -1;
        
        var value = 0;
        while( n > 5 )
        {
            var c = b[ text.charCodeAt( index++ ) ];
            value <<= 6;
            value |= c;
            n -= 6;
        }
        return value;
    };
}

function LZWDecompress( text )
{
    var output = new String();
    var next = 256;
    var max = 4096;
    var table = new Array( max );
    
    for( var i = 0; i < 256; i++ )
    {
        table[ i ] = String.fromCharCode( i );
    }
    
    var dec = new Base64Decoder( text );
    var code, old = dec.getBits( 12 );
    var s, c = String.fromCharCode( old );
    output += table[ old ];
    while( ( code = dec.getBits( 12 ) ) != -1 )
    {
        if( table[ code ] )
        {
            s = table[ code ]; 
        }
        else
        {
            s = table[ old ] + c;
        }
        output += s;
        c = s.charAt( 0 );
        if( next < max)
        {
            table[ next++ ] = table[ old ] + c;
        }
        old = code;
    }
    
    return output;
}

/*@cc_on

@if(@_jscript_version >= 7)

import System;
import System.IO;

var args = System.Environment.GetCommandLineArgs();
var insr = File.OpenText( args[1] );
var text = new String(insr.ReadToEnd());
insr.Close();

text = LZWDecompress( text );

var outsr = File.CreateText( args[2] );
outsr.Write( text );
outsr.Close();

@else

if( WSH )
{
    var fs = new ActiveXObject( "Scripting.FileSystemObject" );
    var infile = fs.OpenTextFile( WSH.Arguments(0) );
    var text = new String(infile.ReadAll());
    infile.Close();
    
    text = LZWDecompress( text );
    
    var outfile = fs.CreateTextFile( WSH.Arguments(1) );
    outfile.Write( text );
    outfile.Close();
}

@end

@*/