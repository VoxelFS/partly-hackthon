'use server';

export async function getParts(vehicleId: string) {
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
