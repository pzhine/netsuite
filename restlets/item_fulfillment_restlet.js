function changeStatus(datain)
{
    var record = nlapiLoadRecord(datain.record_type, datain.record_id);

    var item_count = record.getLineItemCount('item');
    for (var i = 1; i <= item_count; i++)
    {
        record.setLineItemValue('item', 'isclosed', i, 'T');
    }

    nlapiSubmitRecord(record);

    rc = nlapiLoadRecord(datain.record_type, datain.record_id);
    return rc;
}