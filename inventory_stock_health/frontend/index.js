
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
import React from 'react';
import {loadCSSFromString} from '@airtable/blocks/ui';

function HelloWorldBlock() {
    // YOUR CODE GOES HERE
    loadCSSFromString('body { background-color: #f2f4f8; }');
    const base = useBase();
    const table = base.getTableByName('Inventory');
    const records = useRecords(table);
    let countHi = 0;
    let countMed = 0;
    let countLo = 0;
    if(records){
        for (const record of records) {
            if (records && record !== null) {
               if(record.getCellValue('StockAvailability').name === "High in stock"){
                countHi += 1;
               } else if (record.getCellValue('StockAvailability').name === "Medium in stock"){
                countMed += 1;
               } else if (record.getCellValue('StockAvailability').name === "Low in stock"){
                countLo += 1;
               }
            }
        }
    }
    return  <div style={{'text-align':'center'}}>
            <InventoryMonitor countHi={countHi} countMed={countMed} countLo={countLo} records={records}/>
        </div>;
}

class InventoryMonitor extends React.Component {
	constructor() {
		super();
		
		this.state = {
		};
    }
	

	render() {	
        let total = this.props.countHi + this.props.countLo + this.props.countMed;
        let percentlo = Math.floor(this.props.countLo/total * 100);
        let percentmed_orig = Math.floor(this.props.countMed/total * 100);
        let percentmed = Math.floor(this.props.countMed/total * 100) + percentlo;
        let percenthi_orig = Math.floor(this.props.countHi/total * 100);
        let percenthi = Math.floor(this.props.countHi/total * 100) + percentmed + percentlo;
        const multiGraph = {
            'width': '300px',
            'height': '150px',
            'position': 'relative',
            'color': '#fff',
            'font-size': '22px',
            'font-weight': '600',
            'display': 'inline-table', //flex
            'align-items': 'flex-end',
            'justify-content': 'center',
            'overflow': 'hidden',
            'box-sizing': 'border-box',
            'margin': '25px'
        }
        const graph = {
            'width': '300px',
            'height': '150px',
            'border': '50px solid var(--fill)',
            'border-top': 'none',
            'position': 'absolute',
            'transform-origin': '50% 0% 0',
            'border-radius': '0 0 300px 300px',
            'left': '0',
            'top': '100%',
            'z-index': '5',
            'transform': 'rotate(calc(1deg * (var(--percentage) * 1.8)))',
            'box-sizing': 'border-box',
            'cursor': 'pointer',
            "--percentage" : "" + percentlo, 
            "--fill": "#FF4500"
        }
        const graph2 = {
            'width': '300px',
            'height': '150px',
            'border': '50px solid var(--fill)',
            'border-top': 'none',
            'position': 'absolute',
            'transform-origin': '50% 0% 0',
            'border-radius': '0 0 300px 300px',
            'left': '0',
            'top': '100%',
            'z-index': '5',
            'transform': 'rotate(calc(1deg * (var(--percentage) * 1.8)))',
            'box-sizing': 'border-box',
            'cursor': 'pointer',
            "--percentage" : "" + percentmed, 
            "--fill": "#FEDA3E"
        }
        const graph3 = {
            'width': '300px',
            'height': '150px',
            'border': '50px solid var(--fill)',
            'border-top': 'none',
            'position': 'absolute',
            'transform-origin': '50% 0% 0',
            'border-radius': '0 0 300px 300px',
            'left': '0',
            'top': '100%',
            'z-index': '5',
            'transform': 'rotate(calc(1deg * (var(--percentage) * 1.8)))',
            'box-sizing': 'border-box',
            'cursor': 'pointer',
            "--percentage" : "" + percenthi, 
            "--fill": "#08e95d"
        }

		return (
			<div class="card"
                            style={{
                                'transition': 'all 0.4s ease-out',
                                'border-radius': '4px',
                                'padding': '20px',
                                'marginTop': '40px',
                                'marginBottom': '40px',
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
                <div style={{'margin-top':'8px', 'align-items': 'center', 'font-weight': '500', 'color': '#4669db', 'font-size': '22px'}}>Monitor stock inventory</div>
                <div style={multiGraph}>
                    <div data-name="React" style={graph3}>
                    </div>
                    <div data-name="React" style={graph2}>
                    </div>
                    <div data-name="React" style={graph}>
                    </div>
                </div>
                <div style={{'margin-top':'8px', 'align-items': 'center', 'font-weight': '500', 'font-size': '16px'}}>
                    <div style={{'color': '#FF4500'}}>{percentlo + "% Low in stock"}</div>
                     <div  style={{'color': '#FEDA3E'}}>{percentmed_orig + "% Medium in stock"}</div>
                     <div  style={{'color': '#08e95d'}}>{percenthi_orig + "% High in stock"}</div>
                </div>
                <table style={{borderCollapse: 'collapse', width: '100%', marginTop:'28px'}}>
                    <thead>
                        <tr>
                        <td style={{width: '50%', verticalAlign: 'bottom'}}>
                                <Heading variant="caps" size="xsmall" marginRight={3} marginBottom={0}>
                                    Inventory item
                                </Heading>
                            </td>
                            <td style={{width: '50%', verticalAlign: 'bottom'}}>
                                <Heading variant="caps" size="xsmall" marginRight={3} marginBottom={0}>
                                    Stock
                                </Heading>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.records.map(record => {
                        return (
                            <tr key={"row_1"} style={{borderTop: '2px solid #ddd'}}>
                            <td style={{width: '50%', padding: '8px'}}>
                                    <Text marginRight={3}>
                                    {record.getCellValue('InventoryName')}
                                </Text>
                            </td>
                            <td style={{width: '50%', padding: '8px'}}>
                                <Text marginRight={3}>
                                {record.getCellValue('StockAvailability').name}
                                </Text>
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
			</div>
		);
	}
}


initializeBlock(() => <HelloWorldBlock />);
