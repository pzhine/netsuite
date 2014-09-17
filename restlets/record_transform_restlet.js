function getTransformedRecord(datain)
{
    var child_record = nlapiTransformRecord(
                           datain.recordtype,
                           datain.source_id,
                           datain.dest_type);
    return child_record;
}

function saveTransformedRecord(datain)
{
    // Create the item fulfillment record
    var record = getTransformedRecord(datain);

    var new_data = datain.dest_data;

    for (var fieldname in new_data)
    {   
        if (new_data.hasOwnProperty(fieldname))
        {   
            var value = new_data[fieldname];
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
                        record.setLineItemValue(fieldname,
                                                lineitemfieldname,
                                                itemobject,
                                                lineitemfieldvalue);
                    }
                    //record.commitLineItem(fieldname);
                }       
            }          
        }       
    }

    var to_delete = datain.delete_data;
    if (to_delete)
    {   
        for (var key in to_delete)
        {
            record.removeLineItem(to_delete[key].itemtype, to_delete[key].itemindex);
        }   
    }   

    var recordId = nlapiSubmitRecord(record);
    nlapiLogExecution('DEBUG','id='+recordId);
    var nlobj = nlapiLoadRecord(datain.dest_type,recordId);
    return nlobj; 

}