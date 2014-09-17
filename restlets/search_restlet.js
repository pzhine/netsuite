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

    var SLICE_LIMIT = 500;
    var search = nlapiCreateSearch(datain.recordtype, filters, columns);

    var resultset = search.runSearch();

    var results = [];
    var index = 0;
    do {
        var subset = resultset.getResults(index, index+SLICE_LIMIT);
        if (!subset) {
            break;
        }

        subset.forEach(function(row) {
            results.push(row);
            index++;
        });

    } while (subset.length === SLICE_LIMIT);

    return results;

}
