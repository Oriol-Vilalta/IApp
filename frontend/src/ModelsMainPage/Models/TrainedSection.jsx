import TestingSection from "./TestingSection.jsx";
import PredictSection from "./PredictSection.jsx";


const TrainedSection = ({model}) => {

    const gridContainer = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        placeItems: 'center',
        height: '800px'
    }


    return (<div style={gridContainer}>
        <TestingSection model={model}/>
        <PredictSection model={model}/>
    </div>)
}


export default TrainedSection;