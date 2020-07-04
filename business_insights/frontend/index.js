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
    Button
} from '@airtable/blocks/ui';

import React, {useState} from 'react';

function TodoBlock() {
    const globalConfig = useGlobalConfig();
    let detailsMode = globalConfig.get('detailsMode');
    const recordId = globalConfig.get('recordId');


    const base = useBase();

    // Retrieve Selected table 
    const tableId = globalConfig.get('selectedTableId');
    const table = base.getTableByIdIfExists(tableId);
    const records = useRecords(table);
    var customerRecord = useRecordById(table, recordId);

    const customers = records ? records.map( (record, config)  => {
        return <Customer key={record.id} record={record}  config={globalConfig}/>;
    }) : null;

    // Retrieve reward table records
    const rewardTable = base.getTableByName('Customer Reward Points');
    const rewardRecords = useRecords(rewardTable);

    var filteredRewardRecords = [];
    for (const record of rewardRecords) {
        if(record.getCellValue('Phone (from Customers)') == customerRecord.getCellValue('Phone')) {
            filteredRewardRecords.push(record);
        }
    }

    const transactions = filteredRewardRecords ? filteredRewardRecords.map( (record, config)  => {
        return <Transaction key={record.id} record={record}  config={globalConfig}/>;
    }) : null;

    if ( detailsMode === true) {
       return  <div>
           <TablePickerSynced globalConfigKey="selectedTableId" />
        {customers}</div>;
    } else {
        return  <div>
                    <button
                        style={{'float': 'right',
                            'margin-right': '20px',
                            'background-color': '#4CAF50',
                            'border': 'none',
                            'color': 'white',
                            'padding': '15px 32px',
                            'text-align': 'center',
                            'text-decoration': 'none',
                            'display': 'inline-block',
                            'font-size': '16px',
                            'cursor': 'pointer'}}
                        onClick={() => {
                            globalConfig.setAsync('detailsMode', true);
                        }}
                    >
                    Back 
                    </button>
                   <h1> {customerRecord.getCellValue('CustomerName')} </h1>
                   <h2>Recent Transactions</h2>
                   <h2>Date Amount Reward Points</h2>

                  {transactions}
                  </div>;
    }
}

function Customer({record, config}) {
    return (
        <div class="card"
           style={{
             'box-shadow': '2px 2px 2px 2px',
             'transition': '0.3s',
             'border-radius': '4px',
             'padding': '20px',
             'marginTop': '4px',
             'marginBottom': '10px',
             'marginLeft' : '20px',
             'marginRight' : '20px',
             'backgroundColor': '#008CBA',
             'fontFamily' : 'Roboto',
             'color' : 'white',

           }}
           onClick={(globalConfig) => {
                  config.setAsync('detailsMode', false);
                  config.setAsync('recordId', record.id);
           }}
           >
             <h1>{record.name || 'Unnamed record'}</h1>
                    <button
                        style={{'float': 'right',
                            'margin-right': '20px',
                            'background-color': '#4CAF50',
                            'border': 'none',
                            'color': 'white',
                            'padding': '15px 32px',
                            'text-align': 'center',
                            'text-decoration': 'none',
                            'display': 'inline-block',
                            'font-size': '16px',
                            'cursor': 'pointer'}}
                        onClick={() => {
                            expandRecord(record);
                        }}
                    >
                    Expand 
                    </button>
             <p> {record.getCellValue('Phone')} </p>
             <p> {record.getCellValueAsString('Deal (from Deals)')} </p> 
             {/* <TextButton
                    icon="expand"
                    aria-label="Expand record"
                    variant="dark"
                    color="red"
                    onClick={() => {
                     expandRecord(record);
                    }}

            /> */}


        </div>
    );
    
}

function Transaction({record, config}) {
    // return (
    //     <div class="card"
    //        style={{
    //          'box-shadow': '2px 2px 2px 2px',
    //          'transition': '0.3s',
    //          'border-radius': '4px',
    //          'padding': 12,
    //        }}
    //        >
    //          <table >
    //          <tr>
    //          <td>{record.getCellValue('TransactionDate')}</td>
    //          <td>{record.getCellValue('Amount')}</td>
    //          <td>{record.getCellValue('RewardPoints')}</td>
    //          <td> <TextButton
    //                 icon="expand"
    //                 aria-label="Expand record"
    //                 variant="dark"
    //                 onClick={() => {
    //                  expandRecord(record);
    //                 }}
    //         /></td>
    //          </tr>
    //          </table>
                
    //     </div>
    // );

    return (
        <div >
             <table >
             <tr>
             <td>{record.getCellValue('TransactionDate')}</td>
             <td>{record.getCellValue('Amount')}</td>
             <td>{record.getCellValue('RewardPoints')}</td>
             <td> <TextButton
                    icon="expand"
                    aria-label="Expand record"
                    variant="dark"
                    onClick={() => {
                     expandRecord(record);
                    }}
            /></td>
             </tr>
             </table>
                
        </div>
    );
}

initializeBlock(() => <TodoBlock />);