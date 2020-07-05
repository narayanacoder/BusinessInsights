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
    Button,
    Box,
    Heading,
    Text
} from '@airtable/blocks/ui';


import React, {useState} from 'react';
import {loadCSSFromString} from '@airtable/blocks/ui';

function TodoBlock() {
    loadCSSFromString('body { background-color: #f2f4f8; }');

    const globalConfig = useGlobalConfig();
    let detailsMode = globalConfig.get('detailsMode');
    if(detailsMode === undefined || detailsMode === null) {
        detailsMode = true;
    }
    const recordId = globalConfig.get('recordId');

    const base = useBase();

    // Retrieve Selected table 
    const tableId = globalConfig.get('selectedTableId');
    const table = base.getTableByName('Customers');
    const records = useRecords(table);
    var customerRecord;
    if (recordId !== undefined && recordId !== null) {
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
        if (customerRecord !== undefined && customerRecord !== null) {
            if(record.getCellValue('Phone (from Customers)') == customerRecord.getCellValue('Phone')) {
                filteredRewardRecords.push(record);
            }
        }
    }

    const transactions = filteredRewardRecords ? Transactions(filteredRewardRecords) : null;

    // Retrieve deals table records
    const dealTable = base.getTableByName('Deals');
    const dealRecords = useRecords(dealTable);

    var filteredDealRecords = [];
    console.log(customerRecord);
    for (const record of dealRecords) {
        if (customerRecord !== undefined && customerRecord !== null) {
            console.log()
            if(record.getCellValueAsString('Customers').includes(customerRecord.getCellValueAsString('CustomerName'))) {
                filteredDealRecords.push(record);
            }
        }
    }

    const activedeals = filteredDealRecords ? ActiveDeals(filteredDealRecords) : null;

       // Retrieve deals table records
       const recommendationsTable = base.getTableByName('Deals Recommendations');
       const recommendationRecords = useRecords(recommendationsTable);
   
       var filteredRecommendationlRecords = [];
       console.log(customerRecord);
       for (const record of recommendationRecords) {
           if (customerRecord !== undefined && customerRecord !== null) {
               console.log()
               if(record.getCellValueAsString('Customers').includes(customerRecord.getCellValueAsString('CustomerName'))) {
                filteredRecommendationlRecords.push(record);
               }
           }
       }
   
       const recommendationdeals = filteredRecommendationlRecords ? RecommendationDeals(filteredRecommendationlRecords) : null;

    const backIcon = <svg focusable="false" style={{'margin-right':'8px'}} preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><path d="M13 26L14.41 24.59 6.83 17 29 17 29 15 6.83 15 14.41 7.41 13 6 3 16 13 26z"></path><title>Arrow left</title></svg>
    const badge = <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="#fcb400" width="32" height="24" viewBox="0 0 32 32" aria-hidden="true"><path d="M23 2L24.593 5 28 5.414 25.5 7.667 26 11 23 9.125 20 11 20.5 7.667 18 5.414 21.5 5 23 2z"></path><path d="M22.7168,13.249l-1.9375-.498A6.9942,6.9942,0,1,1,15.7505,4.22l.499-1.9365A8.99,8.99,0,0,0,8,17.689V30l6-4,6,4V17.7078A8.9627,8.9627,0,0,0,22.7168,13.249ZM18,26.2627l-4-2.6665-4,2.6665V19.05a8.9238,8.9238,0,0,0,8,.0062Z"></path><title>Badge</title></svg>

    if ( detailsMode === true) {
       return  <div>
           <h1 style={{'margin':'12px'}}> Customers </h1>
        {customers}</div>;
    } else {
        return  <div style={{'margin':'12px'}}>

                    <div class="card"
                            style={{
                                'transition': 'all 0.4s ease-out',
                                'border-radius': '4px',
                                'padding': '20px',
                                'marginTop': '40px',
                                'marginBottom': '10px',
                                'marginLeft' : '20px',
                                'marginRight' : '20px',
                                'fontFamily' : '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
                                'color' : '#171717',
                                'border': '1px solid rgba(0,0,0,.125)',
                                '-webkit-transition':  'box-shadow .6s ease-out',
                                'box-shadow': '.8px .9px 6px rgba(0, 0, 0, .15)',
                                'background-color': '#fff'
                            }}
                            >

                            <span style={{'float':'right', 'margin-right':'20px', 'display':' inline-flex', 'align-items': 'center', 'font-weight': '500', 'color': '#4669db', 'margin-top':'5px'}}>{customerRecord.getCellValue("Reward points") + " points"}{badge}</span>

                            <button
                                style={{
                                    'fontFamily' : '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
                                    'background-color': 'transparent',
                                    'border': 'none',
                                    'color': '#4669db',
                                    'text-align': 'center',
                                    'text-decoration': 'none',
                                    'display': 'inline-block',
                                    'font-size': '16px',
                                    'padding': '0px',
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
                            <div style={{'margin-bottom': '32px'}}>
                                <span
                                    style={{ 'fontFamily' : '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
                                        'font-weight': '700',
                                        'letter-spacing': '1.5px',
                                        'text-transform': 'uppercase',
                                        'color': 'rgba(38, 28, 106, 0.7)',
                                        'font-size': '10px',
                                        'background-color':  '#a6c8ff', 
                                        ...(customerRecord.getCellValue("Customer Membership Rank").color === "blueBright" && {'background-color':  '#a6c8ff'}),
                                        ...(customerRecord.getCellValue("Customer Membership Rank").color === "tealBright" && {'background-color':  '#9ef0f0'}),
                                        ...(customerRecord.getCellValue("Customer Membership Rank").color === "purpleBright" && {'background-color':  '#d4bbff'}),
                                        'padding': '5px 10px',
                                        'border-radius': '10rem'                                        
                                    }}> 
                                    {customerRecord.getCellValue("Customer Membership Rank").name}
                                </span>
                            </div>
                            
                            {transactions}
                            {recommendationdeals}
                            {activedeals}
                            <div id="snackbar" className=""
                                    style={{visibility:"hidden", float:  "right", paddingBottom: "25px",
                                     color: "green", 'font-size': '16px'}}>Sent deal to customer..</div>



                        </div>

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
             <span style={{'float':'right', 'margin-right':'20px', 'margin-top': '5px', 'display':' inline-flex', 'align-items': 'center', 'font-weight': '500', 'color': '#4669db'}}>{record.getCellValue("Reward points") + " points"}{badge}</span>
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
                    {/* <button
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
                    </button> */}
            <div style={{'margin-top':"22px"}}/>
            <p style={{'margin-bottom': '0px', 'font-size': '0.9rem'}}> {record.getCellValue('Phone')} </p>
            <p style={{'margin-top': '8px', 'font-size': '0.9rem'}}> {record.getCellValueAsString('Email')} </p> 
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



// Renders a table
function Transactions(linkedRecords) {

    return (
        <div>
        <Box marginY={3}>
            <h3>Recent Reward Points Acquired</h3>
            <table style={{borderCollapse: 'collapse', width: '100%'}}>
                <thead>
                    <tr>
                    <td style={{width: '25%', verticalAlign: 'bottom'}}>
                            <Heading variant="caps" size="xsmall" marginRight={3} marginBottom={0}>
                                Transaction date
                            </Heading>
                        </td>
                        <td style={{width: '25%', verticalAlign: 'bottom'}}>
                            <Heading variant="caps" size="xsmall" marginRight={3} marginBottom={0}>
                                Amount
                            </Heading>
                        </td>
                        <td style={{width: '25%', verticalAlign: 'bottom'}}>
                           <Heading variant="caps" size="xsmall" marginRight={3} marginBottom={0}>
                                Reward Points
                            </Heading>
                        </td>
                        <td style={{width: '25%', verticalAlign: 'bottom'}}>
                           <Heading variant="caps" size="xsmall" marginRight={3} marginBottom={0}>
                                Business Location
                            </Heading>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {linkedRecords.map(linkedRecord => {
                        return (
                            <tr key={linkedRecord.id} style={{borderTop: '2px solid #ddd'}}>
                                <td style={{width: '25%', padding: '8px'}}>
                                        <Text marginRight={3}>
                                        {linkedRecord.getCellValue('TransactionDate')}
                                    </Text>
                                </td>
                                <td style={{width: '25%', padding: '8px'}}>
                                    <Text marginRight={3}>
                                    {linkedRecord.getCellValue('Amount')}
                                    </Text>
                                </td>
                                <td style={{width: '25%', padding: '8px'}}>
                                <Text marginRight={3}>
                                    {linkedRecord.getCellValue('RewardPoints')}
                                    </Text>
                                </td>
                                <td style={{width: '25%', padding: '8px'}}>
                                <Text marginRight={3}>
                                    {linkedRecord.getCellValue('Location (from Business Branches)')}
                                    </Text>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Box>
        </div>
    );
}

// Renders a table
function ActiveDeals(linkedRecords) {

    return (
        <div>
        <Box marginY={3}>
            <h3>Current Deals</h3>
            <table style={{borderCollapse: 'collapse', width: '100%'}}>
                <thead>
                    <tr>
                    <td style={{width: '33%', verticalAlign: 'bottom'}}>
                            <Heading variant="caps" size="xsmall" marginRight={3} marginBottom={0}>
                                Deal
                            </Heading>
                        </td>
                        <td style={{width: '33%', verticalAlign: 'bottom'}}>
                            <Heading variant="caps" size="xsmall" marginRight={3} marginBottom={0}>
                                Start Date
                            </Heading>
                        </td>
                        <td style={{width: '33%', verticalAlign: 'bottom'}}>
                            <Heading variant="caps" size="xsmall" marginRight={3} marginBottom={0}>
                                End Date
                            </Heading>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {linkedRecords.map(linkedRecord => {
                        return (
                            <tr key={linkedRecord.id} style={{borderTop: '2px solid #ddd'}}>
                                <td style={{width: '33%', padding: '8px'}}>
                                        <Text marginRight={3}>
                                        {linkedRecord.getCellValue('Deal')}
                                    </Text>
                                </td>
                                <td style={{width: '33%', padding: '8px'}}>
                                    <Text marginRight={3}>
                                    {linkedRecord.getCellValue('Start date')}
                                    </Text>
                                </td>
                                <td style={{width: '33%', padding: '8px'}}>
                                    <Text marginRight={3}>
                                    {linkedRecord.getCellValue('Due date')}
                                    </Text>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Box>
        </div>
    );
}

// Renders a table
function RecommendationDeals(linkedRecords) {

    return (
        <div>
        <Box marginY={3}>
            <h3>Recommended New Deals</h3>
            <table style={{borderCollapse: 'collapse', width: '100%'}}>
                <thead>
                    <tr>
                    <td style={{width: '40%', verticalAlign: 'bottom'}}>
                            <Heading variant="caps" size="xsmall" marginRight={3} marginBottom={0}>
                                Deal
                            </Heading>
                        </td>
                        <td style={{width: '20%', verticalAlign: 'bottom'}}>
                            <Heading variant="caps" size="xsmall" marginRight={3} marginBottom={0}>
                                Start Date
                            </Heading>
                        </td>
                        <td style={{width: '20%', verticalAlign: 'bottom'}}>
                            <Heading variant="caps" size="xsmall" marginRight={3} marginBottom={0}>
                                End Date
                            </Heading>
                        </td>
                        <td style={{width: '20%', verticalAlign: 'bottom'}}>
                            <Heading variant="caps" size="xsmall" marginRight={3} marginBottom={0}>
                                Notify
                            </Heading>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {linkedRecords.map(linkedRecord => {
                        return (
                            <tr key={linkedRecord.id} style={{borderTop: '2px solid #ddd'}}>
                                <td style={{width: '40%', padding: '8px'}}>
                                        <Text marginRight={3}>
                                        {linkedRecord.getCellValue('Deal')}
                                    </Text>
                                </td>
                                <td style={{width: '20%', padding: '8px'}}>
                                    <Text marginRight={3}>
                                    {linkedRecord.getCellValue('Start date')}
                                    </Text>
                                </td>
                                <td style={{width: '20%', padding: '8px'}}>
                                    <Text marginRight={3}>
                                    {linkedRecord.getCellValue('Due date')}
                                    </Text>
                                </td>
                                <td style={{width: '20%', padding: '8px'}}>
                                    <Text marginRight={3}>
                                    <button
                                    style={{
                                    'margin-right': '20px',
                                    'margin-top': '8px',
                                    'background-color': '#0062ff',
                                    'border': 'none',
                                    'color': 'white',
                                    'padding': '4px 4px 4px 4px',
                                    'text-align': 'center',
                                    'text-decoration': 'none',
                                    'display': 'inline-block',
                                    'font-size': '8px',
                                    'border-radius': '10rem',
                                    'cursor': 'pointer'}}
                                    onClick={() => {
                                        sendNotification();
                                    }}
                                    >
                                    Send SMS
                                    </button>
                                    </Text>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Box>
        </div>
    );
}

function sendNotification() {
    var x = document.getElementById("snackbar");
    x.style.visibility = "visible";
    setTimeout(function(){ x.style.visibility = "hidden";; }, 2000);
  }

initializeBlock(() => <TodoBlock />);