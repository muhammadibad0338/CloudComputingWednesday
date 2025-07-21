'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAzureData } from '@/lib/actions/azureActions';





export default function AzurePage() {
    const dispatch = useDispatch();
    const { azure, loading, error } = useSelector((state) => state.azure);
    const [paramData, setParamData] = useState({
        'page': 2,
        'limit': 20
    })

    useEffect(() => {
        dispatch(getAzureData(paramData));
    }, [dispatch, paramData]);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Azure Pricing</h2>
            <pre>{JSON.stringify(azure, null, 2)}</pre>
        </div>
    );
}
