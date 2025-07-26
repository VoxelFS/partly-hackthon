'use server';

export async function getVehicle(plate: string) {
    const response = await fetch('https://api.dev2.partly.pro/api/v1/vehicles.search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({
            identifier: {
                plate: plate,
                region: 'UREG32',
                state: null,
            },
            languages: ['en-NZ', 'en'],
        }),
    });

    if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        throw new Error('Failed to fetch vehicle info');
    }

    return await response.json();
}
