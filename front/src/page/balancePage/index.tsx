import React from 'react';
import { Page } from '../../component/page';
import { sizeTitle } from '../../contexts/commonProps';

function BalancePage(): React.ReactElement {

    return (
        <Page text='Main wallet' size={sizeTitle.small}>
            <React.Fragment>
                <div>TEST</div>
            </React.Fragment>
        </Page >
    )
}

export default BalancePage