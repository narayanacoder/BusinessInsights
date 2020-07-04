import {
    initializeBlock,
    useBase,
    useRecords,
    expandRecord,
    TextButton,
    TablePickerSynced,
    FieldPickerSynced,
    useGlobalConfig,
    useRecordById,
    useLoadable,
    useWatchable
} from '@airtable/blocks/ui';

import React, {useState} from 'react';


function TodoBlock() {
    const base = useBase();

    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get('selectedTableId');
    let detailsMode = globalConfig.get('detailsMode');
    //detailsMode = (detailsMode === null) ? false : true;
    const recordId = globalConfig.get('recordId');
    const table = base.getTableByIdIfExists(tableId);
    const records = useRecords(table);



     const rewardTable = base.getTableByName('Customer Reward Points');
     const rewardRecords = useRecords(rewardTable);

    for (const record of rewardRecords) {
        console.log("Record =", record.Amount);

    }

    console.log("LOG3 =", detailsMode);
    const tasks = records ? records.map( (record, config)  => {
        return <Task key={record.id} record={record}  config={globalConfig}/>;
    }) : null;
    var customerRecord = useRecordById(table, recordId);
    if ( detailsMode === true) {
       return  <div>
           <TablePickerSynced globalConfigKey="selectedTableId" />
        {tasks}</div>;
    } else {
        return  <div>
                  'Hello World'
                   <h1> {customerRecord.name} </h1>
                  <button
                  onClick={() => {
                       globalConfig.setAsync('detailsMode', true);
                    }}
                    >
                    Back
                  </button>
                  </div>;
    }
}

function Task({record, config}) {
    return (
        <div class="card"
           style={{
             'box-shadow': '4px 4px 4px 4px',
             'transition': '0.3s',
             'border-radius': '10px',
             'padding': 12,
           }}
           onClick={(globalConfig) => {
                  config.setAsync('detailsMode', false);
                  config.setAsync('recordId', record.id);
           }}
           >
             <h1>{record.name || 'Unnamed record'}</h1>
             <p >{record.getCellValue('Phone')}</p>
             <p>{record.getCellValue('Deal (from Deals)')}</p>
                <TextButton
                    icon="expand"
                    aria-label="Expand record"
                    variant="dark"
                    onClick={() => {
                     expandRecord(record);
                    }}
            />
        </div>
    );
}

initializeBlock(() => <TodoBlock />);