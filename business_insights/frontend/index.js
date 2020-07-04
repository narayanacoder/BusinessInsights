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
import {loadCSSFromString} from '@airtable/blocks/ui';

function TodoBlock() {
    loadCSSFromString('body { background-color: #f2f4f8; }');

    const globalConfig = useGlobalConfig();
    let detailsMode = globalConfig.get('detailsMode');
    if(detailsMode === undefined) {
        detailsMode = true;
    }
    const recordId = globalConfig.get('recordId');

    const base = useBase();

    // Retrieve Selected table 
    const tableId = globalConfig.get('selectedTableId');
    const table = base.getTableByIdIfExists(tableId);
    const records = useRecords(table);
    var customerRecord;
    if (recordId !== undefined) {
        customerRecord = useRecordById(table, recordId);
    }

    const customers = records ? records.map( (record, config)  => {
        return <Customer key={record.id} record={record}  config={globalConfig}/>;
    }) : null;

    // Retrieve reward table records
    const rewardTable = base.getTableByName('Customer Reward Points');
    const rewardRecords = useRecords(rewardTable);

    var filteredRewardRecords = [];
    console.log(customerRecord);
    for (const record of rewardRecords) {
        if (customerRecord !== undefined) {
            if(record.getCellValue('Phone (from Customers)') == customerRecord.getCellValue('Phone')) {
                filteredRewardRecords.push(record);
            }
        }
        
    }

    const transactions = filteredRewardRecords ? filteredRewardRecords.map( (record, config)  => {
        return <Transaction key={record.id} record={record}  config={globalConfig}/>;
    }) : null;

    const backIcon = <svg focusable="false" style={{'margin-right':'8px'}} preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><path d="M13 26L14.41 24.59 6.83 17 29 17 29 15 6.83 15 14.41 7.41 13 6 3 16 13 26z"></path><title>Arrow left</title></svg>

    if ( detailsMode === true) {
       return  <div>
           <TablePickerSynced globalConfigKey="selectedTableId" />
        {customers}</div>;
    } else {
        return  <div style={{'margin':'32px'}}>
                    <button
                        style={{'float': 'right',
                            'fontFamily' : '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
                            'background-color': 'transparent',
                            'border': 'none',
                            'color': '#4669db',
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
                        <div style={{'display':' inline-flex', 'align-items': 'center'}}>
                            {backIcon}
                            Back 
                        </div>
                    </button>
                   <h1> {customerRecord.getCellValue('CustomerName')} </h1>
                   <h2>Recent Transactions</h2>
                   <h2>Date Amount Reward Points</h2>

                  {transactions}
                  </div>;
    }
}

function Customer({record, config}) {
    const [hovered, setHovered] = useState(false);
    const toggleHover = () => setHovered(!hovered);

    const badge = <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="#fcb400" width="32" height="24" viewBox="0 0 32 32" aria-hidden="true"><path d="M23 2L24.593 5 28 5.414 25.5 7.667 26 11 23 9.125 20 11 20.5 7.667 18 5.414 21.5 5 23 2z"></path><path d="M22.7168,13.249l-1.9375-.498A6.9942,6.9942,0,1,1,15.7505,4.22l.499-1.9365A8.99,8.99,0,0,0,8,17.689V30l6-4,6,4V17.7078A8.9627,8.9627,0,0,0,22.7168,13.249ZM18,26.2627l-4-2.6665-4,2.6665V19.05a8.9238,8.9238,0,0,0,8,.0062Z"></path><title>Badge</title></svg>

    return (
        <div class="card"
           onMouseEnter={toggleHover}
           onMouseLeave={toggleHover}
           style={{
             'transition': 'all 0.4s ease-out',
             'border-radius': '4px',
             'padding': '20px',
             'marginTop': '4px',
             'marginBottom': '10px',
             'marginLeft' : '20px',
             'marginRight' : '20px',
             'fontFamily' : '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
             'color' : '#171717',
             'border': '1px solid rgba(0,0,0,.125)',
             ...(!hovered && {'-webkit-transition':  'box-shadow .6s ease-out'}),
             ...(!hovered && {'box-shadow': '.8px .9px 6px rgba(0, 0, 0, 0)'}),
             ...(!hovered && {'background-color': '#fff'}),


             ...(hovered && {'-webkit-transition':  'box-shadow .6s ease-out'}),
             ...(hovered && {'box-shadow': '.8px .9px 6px rgba(0, 0, 0, .25)'}),
             ...(hovered && {'background-color': '#eef4ff'}),
           }}
           onClick={(globalConfig) => {
                  config.setAsync('detailsMode', false);
                  config.setAsync('recordId', record.id);
           }}
           >
             <span style={{'float':'right', 'margin-right':'20px', 'display':' inline-flex', 'align-items': 'center', 'font-weight': '500', 'color': '#4669db'}}>{record.getCellValue("Reward points") + " points"}{badge}</span>
             <h1>{record.name || 'Unnamed record'}</h1>
             <span
                style={{ 'fontFamily' : '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
                    'font-weight': '700',
                    'letter-spacing': '1.5px',
                    'text-transform': 'uppercase',
                    'color': 'rgba(38, 28, 106, 0.7)',
                    'font-size': '10px',
                    'background-color':  '#a6c8ff', 
                    ...(record.getCellValue("Customer Membership Rank").color === "blueBright" && {'background-color':  '#a6c8ff'}),
                    ...(record.getCellValue("Customer Membership Rank").color === "tealBright" && {'background-color':  '#9ef0f0'}),
                    ...(record.getCellValue("Customer Membership Rank").color === "purpleBright" && {'background-color':  '#d4bbff'}),
                    'padding': '5px 10px',
                    'border-radius': '10rem'
                }}> 
                {record.getCellValue("Customer Membership Rank").name}
             </span>
                    <button
                        style={{'float': 'right',
                            'margin-right': '20px',
                            'margin-top': '8px',
                            'background-color': '#0062ff',
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
                    View 
                    </button>
            <div style={{'margin-top':"22px"}}/>
            <p style={{'margin-bottom': '0px', 'font-size': '0.9rem'}}> {record.getCellValue('Phone')} </p>
            <p style={{'margin-top': '8px', 'font-size': '0.9rem'}}> {record.getCellValueAsString('Deal (from Deals)')} </p> 
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