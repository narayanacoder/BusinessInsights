
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
    const globalConfig = useGlobalConfig();
    const base = useBase();
    const table = base.getTableByName('Business Branches');
    const records = useRecords(table);
    var filteredRecords = [];
    var filteredImages = [];
    if(records){
        for (const record of records) {
            if (records && record !== null) {
                filteredRecords.push({name: record.getCellValue('Branch Name'), location: record.getCellValue('Location'), rating: record.getCellValue('Customer Rating')});
                filteredImages.push(record.getCellValue('Profile Image'));
            }
        }
    }
    loadCSSFromString('body { background-color: #f2f4f8; }');
    return  <>
                <div style={{'margin-top':'8px', 'text-align':'center', 'align-items': 'center', 'font-weight': '500', 'color': '#4669db', 'font-size': '22px'}}>Browse local business branches</div>
                <Carousel images={filteredImages} records={filteredRecords}/>    
            </>;
}


class Carousel extends React.Component {
	constructor() {
		super();
		
		this.state = {
			currentIndex: 0,
			isTransitioning: false,
			goingLeft: false
		};
    }
	
	componentDidMount() {
        window.addEventListener('keyup', this.onKeyUp);
	}
	
	componentWillUnmount() {
		window.removeEventListener('keyup', this.onKeyUp);
	}
	
	onKeyUp = (e) => {
		if (e.keyCode) {
			if (e.keyCode === 39) {
				this.showNextSet();
			} else if (e.keyCode === 37) {
				this.showPrevSet();
			}
		}
	}

	render() {
        const { currentIndex, isTransitioning, goingLeft } = this.state;
        const activeStyle = {'opacity': '1', 'transform': 'scale(1)'};
        const backIcon = <svg focusable="false" style={{'margin-right':'8px'}} preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><path d="M13 26L14.41 24.59 6.83 17 29 17 29 15 6.83 15 14.41 7.41 13 6 3 16 13 26z"></path><title>Arrow left</title></svg>
        const forwardIcon = <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><path d="M18 6L16.6 7.4 24.1 15 3 15 3 17 24.1 17 16.6 24.6 18 26 28 16z"></path><title>Arrow right</title></svg>;
        const starIcon = <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="#fcb400" width="26" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M16,2l-4.55,9.22L1.28,12.69l7.36,7.18L6.9,30,16,25.22,25.1,30,23.36,19.87l7.36-7.17L20.55,11.22Z"></path><title>Star filled</title></svg>;

        const carouselButton = {
            'background': '#fff',
            'border': '0',
            'color': '#4669db',
            'cursor': 'pointer',
           ' font-size': '1rem',
            'flex-grow': '1',
            'outline': 'none',
            'padding': '1rem',
            'transition': 'all .1s ease-out',
        };

        const carouselContainer = {
            'display': 'flex',
            'height': '300px',
            'position': 'relative',
            'overflow': 'hidden'
        }

        const carouselWrapper = {
           'border-radius': '5px',
            'box-shadow': '0 1rem 2rem rgba(purple, .2)',
            'margin': '1rem auto',
            'overflow': 'hidden',
            'width': '400px'
        }
		
		return (
			<div style={carouselWrapper}>
				<div style={carouselContainer}>
					{this.props.images.map((img, index) => {
                        let className = 'carousel__image';
                        let carouselStyle = {
                            'position': 'absolute',
                            'left': '0',
                            'opacity': '0',
                            'top': '0',
                            'transform': 'scale(1.1)',
                            'transition': 'all .15s ease-out',
                            'height':'300px'
                        };
						if (index === currentIndex) className += ' active';
                        if (index === currentIndex) carouselStyle = {...carouselStyle, ...activeStyle};
						
						return <img src={img[0].url} className={className} key={`img-${index}`} style={{...carouselStyle}} />;
					})}
				</div>
                <div style={{'background-color':'white', 'padding': '20px', 'padding-left':'36px', 'padding-bottom':'0px','font-size':'16px'}}>
                    <span style={{'color':'#4669db', 'font-weight':'500'}}>
                        Branch:
                    </span>
                    {this.props.records.map((record, index) => {
                        let text = '';
                        if (index === currentIndex){
                            text = record.name;                        
                            return " " + text;
                        }
                    })}                
                </div>
                <div style={{'background-color':'white', 'padding': '0px', 'padding-left':'36px', 'font-size':'16px'}}>
                    <span style={{'color':'#4669db', 'font-weight':'500'}}>
                        Location:
                    </span>
                    {this.props.records.map((record, index) => {
                        let text = '';
                        if (index === currentIndex){
                            text = record.location;
                            return " " + text;
                        }
                    })}
                </div>
                <div style={{'background-color':'white', 'padding': '0px', 'padding-left':'36px', 'font-size':'16px'}}>
                    <span style={{'color':'#4669db', 'font-weight':'500'}}>
                        Customer Rating:
                    </span>
                    {this.props.records.map((record, index) => {
                        let text = '';
                        if (index === currentIndex){
                            let num = parseInt(record.rating, 10);
                            console.log(num);
                            return [...Array(num)].map((e, i) => <span>{starIcon}</span>)
                        }
                    })}
                </div>
				<div style={{'display': 'flex'}}>
					<button style={carouselButton} onClick={this.showPrevSet}>{backIcon}</button>
					<button style={carouselButton} onClick={this.showNextSet}>{forwardIcon}</button>
				</div>
			</div>
		);
	}
	
	showPrevSet = () => {
		const currentIndex = (this.state.currentIndex - 1 + this.props.images.length) % this.props.images.length;
		this.setState({ currentIndex });
	}
	
	showNextSet = () => {
		const currentIndex = (this.state.currentIndex + 1) % this.props.images.length;
		this.setState({ currentIndex });
	}
}

initializeBlock(() => <HelloWorldBlock />);
