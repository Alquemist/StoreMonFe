import React, {useState} from 'react';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Otpremnice from './Otpremnice';
import OtpremniceReporter from './OtpremniceReporter';
import MP from './MP';
//import MPList from './MPList'

const TabWrapper = () => {
    const [activeTab, setActiveTab] = useState(0)
    return (
            <Tabs id="otpremniceTabs" activeKey={activeTab} mountOnEnter={true} onSelect={t=>setActiveTab(t)}>
                <Tab eventKey={0} title="MP">
                    <MP/>
                </Tab>
                <Tab eventKey={1} title="MP Pregled">
                    <h1>{"<MPList/>"}</h1>
                </Tab>
                <Tab eventKey={2} title="VP">
                    <Otpremnice/>
                </Tab>
                <Tab eventKey={3} title="VP Pregled" >
                    <OtpremniceReporter/>
                </Tab>
            </Tabs>        
    )
};

export default TabWrapper;

