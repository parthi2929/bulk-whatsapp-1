function isAlphaNumeric( string )
{
	return string.match( /^[0-9a-zA-Z]+$/ ) != null;
}

exports.encodeWhatsAppFormatFromQuill = function(quillContents)
{
    quillContents = quillContents.ops;
    
        var string = '';
    
        for( var i=0; i<quillContents.length; i++ ){
            var fix = '';
            var space = '';
    
            var segment = quillContents[i].insert;
            var spaceEnd = '';
    
    
            if( quillContents[i].attributes != undefined ){
                if( quillContents[i].attributes.underline ){
                    fix += '```';
                }else{
                    if( quillContents[i].attributes.strike )
                        fix += '~';
                    if( quillContents[i].attributes.italic )
                        fix += '_';
                    if( quillContents[i].attributes.bold )
                        fix += '*';
    
                    var lastString = ' ';
                    if( string.length > 0 )
                        lastString = string[string.length - 1];
                    
    
    
                    if( isAlphaNumeric( lastString ) ){
                        space = ' ';
                    }
    
                    if( segment[0] == ' ' ){
                        segment = segment.substring( 1 );
                        space = ' ';
                    }
    
                    if( segment[segment.length - 1] == ' ' ){
                        segment = segment.substring( 0, segment.length - 1 );
                        spaceEnd = ' ';
                    }
                }
    
            }else{
                if( i != 0 ){
                    if( quillContents[i-1].attributes != undefined
                        && isAlphaNumeric( segment[0] )
                    ){
                        space = ' ';
    
    
                    }
                }
            }
    
            
    
            string += space + fix + segment + fix.split( '' ).reverse(  ).join( '' ) + spaceEnd;
    
        }
    
        return string;
}