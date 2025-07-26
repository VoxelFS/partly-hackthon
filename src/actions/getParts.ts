'use server';

import data from '../../public/data.json';

export async function getParts(vehicleId: string) {
    // Check if we're using hardcoded data by checking an environment variable. If does not exist, use hardcoded data.
    if (process.env.LIVE_DATA !== 'true') {
        // Return data.json from the public directory
        return data;
    }

    const response = await fetch('https://api.dev2.partly.pro/api/v1/assemblies.v2.search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({
            "oem_vehicle_id": vehicleId
        }),
    });

    if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        throw new Error('Failed to fetch vehicle info');
    }

    return await response.json();
}
