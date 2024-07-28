import React, { useState } from 'react';
import { useZxing } from "react-zxing";

const Attendance = () => {
    const [scannedResult, setScannedResult] = useState('');

    const { ref } = useZxing({
        onResult(result) {
          setScannedResult(result.getText());
        },
      });
    return (
        <div className=''>
            <video ref={ref} />
        </div>
    )
}

export default Attendance