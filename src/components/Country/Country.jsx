import React from 'react'
import { Card, Elevation, H5, Button, Divider, Callout} from '@blueprintjs/core'
import { Margin10 } from  '../GlobalStyle/Margin';

function Country() {
    return (
        <div>
            <Callout title='Stats for Algeria' icon='flag' intent='Primary'>
                Updated covid-19 statistics for your precised Country
                It will updated each 1 minute
            </Callout>
            <Margin10/>
            <Card elevation={Elevation.THREE} interactive={true}>
                <H5>
                    New Cases
                </H5>
                <p>
                    User interfaces that enable people to interact smoothly with data, ask better questions, and
                    make better decisions.
                </p>
                <Button icon="refresh" intent="success" >
                    Refrech
                </Button>
            </Card>
            <Divider/>
            <Card elevation={Elevation.THREE} interactive={true}>
                <H5>
                    Recovered
                </H5>
                <p>
                    User interfaces that enable people to interact smoothly with data, ask better questions, and
                    make better decisions.
                </p>
                <Button icon="refresh" intent="success" >
                    Refrech
                </Button>
            </Card>
            <Divider/>
            <Card elevation={Elevation.THREE} interactive={true}>
                <H5>
                    Death
                </H5>
                <p>
                    User interfaces that enable people to interact smoothly with data, ask better questions, and
                    make better decisions.
                </p>
                <Button icon="refresh" intent="success" >
                    Refrech
                </Button>
            </Card>
            
        </div>
    )
}

export default Country
