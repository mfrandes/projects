module.exports = ( function()
{
    var utilities = {};

    utilities.cleanRichText = function( richText )
    {
        if (!richText)
        {
            return null;
        }

        var cleanText = richText.replace( /<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "" );
        if(cleanText === "")
        {
            return null;
        }
        else
        {
            return cleanText;
        }
    };

    return utilities;
}() );