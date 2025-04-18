import {Button, Pagination, Stack, Typography} from "@mui/material";
import {ResultsDisplay} from "./ResultsDisplay.jsx";
import React, {useState} from "react";


const TestingSection = ({model}) => {
    const [hasTest, setHasTest] = useState(false);
    const [loading, setLoading] = useState(false);

    const container = {
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'white',
        borderRadius: '10px',

        width: '94.5%',
        height: '700px',

        margin: '5px',
        marginBottom: '15px',
        padding: '30px',

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }

    const other = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '30px'
    }

    const leftOriented = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        placeItems: 'left',

        padding: '10px'
    }

    const runTests = async () => {
        setLoading(true);
        const url = "http://127.0.0.1:5000/models/"+ model.id + "/test";
        const res = await fetch(url, {
            mode: 'cors',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const message = await res.json()
        setLoading(false)
    }


    return (<div style={container}>

            <h1 style={{fontSize: 36}}>Test</h1>
            <div style={leftOriented}>
                {model.learner.test_accuracy != null &&
                    <div style={other}>

                        <p style={{fontSize: 26}}>Tested Accuracy:</p>
                        <p style={{fontSize: 20}}>{Math.round((model.learner.test_accuracy) *100)}%</p>

                    </div>
                }

                {model.learner.test_loss != null && <div style={other}>

                    <p style={{fontSize: 26}}>Tested Loss:</p>
                    <p style={{fontSize: 20}}>{Math.round((model.learner.test_loss) *100)}%</p>

                </div>
                }
                <Button variant={"contained"} onClick={runTests} disabled={loading}>RUN TESTING</Button>

            </div>

    </div>)
}

export default TestingSection;