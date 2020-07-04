import {
    initializeBlock,
    useBase,
    useRecords,
    expandRecord,
    TextButton,
    TablePickerSynced,
    FieldPickerSynced,
    useGlobalConfig
} from '@airtable/blocks/ui';

import React, {useState} from 'react';

function TodoBlock() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get('selectedTableId');
    const table = base.getTableByIdIfExists(tableId);
    const records = useRecords(table);
    const tasks = records ? records.map(record => {
        return <Task key={record.id} record={record} />;
    }) : null;
    return  <div>
                    <TablePickerSynced globalConfigKey="selectedTableId" />
        {tasks}</div>;
}

function Task({record}) {
    // return (
    //     <div
    //     style={{
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'space-between',
    //         fontSize: 18,
    //         padding: 12,
    //         borderBottom: '1px solid #ddd',
    //     }}
    // >
    //         <p>{record.name || 'Unnamed record'}</p>
    //         <p>({record.getCellValue('Phone')}
    //         {record.getCellValue('Deal (from Deals)')})</p>
    //         <TextButton
    //             icon="expand"
    //             aria-label="Expand record"
    //             variant="dark"
    //             onClick={() => {
    //                 expandRecord(record);
    //             }}
    //         />
    //     </div>
    // );

    return (
        <div class="card">
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
  {/* <p><button>Add to Cart</button></p> */}
</div>
    );
}

initializeBlock(() => <TodoBlock />);