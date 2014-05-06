// Search for a NetSuite record
function searchRecord(datain)
{
    // Get filters as JSON
    var filters = JSON.parse(datain.filters);

    // Define search columns
    var columns = new Array();
    if (datain.columns) {
        for (var i = 0; i < datain.columns.length; i++) {
            columns[i] = new nlobjSearchColumn(datain.columns[i]);
        }
    }

    // Execute the search
    return nlapiSearchRecord(datain.recordtype, null, filters, columns);
}
