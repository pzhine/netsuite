// Get a standard NetSuite record
function getRecord(datain)
{
    return nlapiLoadRecord(datain.recordtype, datain.id); // e.g recordtype="customer", id="769"
}

// Create a standard NetSuite record
// Sample datain: {"entity":"123","recordtype":"salesorder","item": [{"item":"10","quantity":"1"},{"item":"11","quantity":"1"}]}
function createRecord(datain)
{
    var err = new Object();
    // Validate if mandatory record type is set in the request
    if (!datain.recordtype)
    {   
        err.status = "failed";
        err.message= "missing recordtype";
        return err;
    }   

    var record = nlapiCreateRecord(datain.recordtype);

    if (datain.initialvalues) {
        record = nlapiCreateRecord(datain.recordtype, datain.initialvalues);
    }

    if (datain.id) {
        record = nlapiLoadRecord(datain.recordtype,datain.id);
    }

    for (var fieldname in datain)
    {   
        if (datain.hasOwnProperty(fieldname))
        {   
            if (fieldname != 'recordtype' && fieldname != 'id' && fieldname != 'initialvalues')
            {   
                var value = datain[fieldname];
                if (value && typeof value != 'object') // ignore other type of parameters
                {   
                    record.setFieldValue(fieldname, value);
                }   

                // http://usergroup.netsuite.com/users/showpost.php?p=149264&postcount=5
                if (value && typeof value == 'object') // process line item objects
                {   
                    for (var itemobject in value)
                    {   
                        record.selectNewLineItem(fieldname);
                        var lineitemobject= value[itemobject];
                        for (var lineitemfieldname in lineitemobject )
                        {   
                            var lineitemfieldvalue = lineitemobject[lineitemfieldname];
                            record.setCurrentLineItemValue(fieldname,lineitemfieldname,lineitemfieldvalue);
                        }
                        record.commitLineItem(fieldname);
                    }
                }       
            }       
        }       
    }       

    var recordId = nlapiSubmitRecord(record);
    nlapiLogExecution('DEBUG','id='+recordId);
    var nlobj = nlapiLoadRecord(datain.recordtype,recordId);
    return nlobj; 

}

// Delete a standard NetSuite record
function deleteRecord(datain)
{
    nlapiDeleteRecord(datain.recordtype, datain.id); // e.g recordtype="customer", id="769"
}