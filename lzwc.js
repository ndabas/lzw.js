// 
// LZW Compress
//

function Base64Encode( c )
{
    var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var s = b.charAt( ( c >> 6 ) & 63 ) + b.charAt( c & 63 );
    
    return s;
}

function LZWCompress( text )
{
    var output = new String();
    var table = new Object();
    var next = 256;
    var max = 4096;
    
    for( var i = 0; i < 256; i++ )
    {
        table[ String.fromCharCode( i ) ] = i;
    }
    
    var s = text.charAt( 0 );
    for( var i = 1; i < text.length; i++ )
    {
        var c = text.charAt( i );
        if( table[ s + c ] )
        {
            s += c;
        }
        else
        {
            output += Base64Encode( table[ s ] );
            if( next < max )
            {
                table[ s + c ] = next++;
            }
            s = c;
        }
    }
    output += Base64Encode( table[ s ] );
    
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

text = LZWCompress( text );

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
    
    text = LZWCompress( text );
    
    var outfile = fs.CreateTextFile( WSH.Arguments(1) );
    outfile.Write( text );
    outfile.Close();
}

@end

@*/