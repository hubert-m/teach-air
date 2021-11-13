import React from 'react';
import img from '../assets/loading.gif';

const Loading = (props) => {
    return (
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
            <img style={{height: props.size || 200, width: props.size || 200}}
                src={img} alt="Loading"/>
        </div>
    );
};

export default Loading;
