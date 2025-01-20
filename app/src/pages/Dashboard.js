import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../components/Layout/Layout";

const Dashboard = () => {
    const [mobiles, setMobiles] = useState([]);
    const [laptops, setLaptops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/Dashboard.php`);
                setMobiles(response.data.mobileQuantities);
                setLaptops(response.data.laptopQuantities);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to load data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getTotalQuantities = (items) => {
        let total = 0;
        items.forEach(item => {
            Object.values(item.quantities).forEach(quantity => {
                total += quantity;
            });
        });
        return total;
    };

    if (isLoading) {
        return (
            <Layout>
                <div>Loading data...</div>
            </Layout>
        );
    }

    if (!mobiles.length && !laptops.length) {
        return (
            <Layout>
                <div>No data found.</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex flex-wrap justify-center">
                {/* Mobile Quantities Column */}
                <div className="w-full md:w-1/2 px-4 py-8 bg-gray-100 rounded-lg">
                    <div className="mb-4 text-lg bg-[#a0f630] text-white p-4 rounded-lg">
                        <h2 className="text-center">Mobile</h2>
                        <h2 className="text-center">Total Quantity: {getTotalQuantities(mobiles)}</h2>
                    </div>
                    {mobiles.map((mobile, index) => (
                        <div key={index} className="mb-3 p-4 bg-white rounded-lg shadow-lg flex justify-between items-center">
                            <h4 className="mb-2 justify-center">{mobile.model}</h4>
                            <div className="">
                                {Object.entries(mobile.quantities).map(([condition, quantity]) => (
                                    <p key={condition}>{condition}: {quantity}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Laptop Quantities Column */}
                <div className="w-full md:w-1/2 px-4 py-8 bg-gray-100 rounded-lg">
                    <div className="mb-4 text-lg bg-[#23395d] text-white p-4 rounded-lg">
                        <h2 className="text-center">Laptop</h2>
                        <h2 className="text-center">Total Quantity: {getTotalQuantities(laptops)}</h2>
                    </div>
                    {laptops.map((laptop, index) => (
                        <div key={index} className="mb-3 p-4 bg-white rounded-lg shadow-lg flex justify-between items-center">
                            <h4 className="mb-2 justify-center">{laptop.model}</h4>
                            <div className="">
                                {Object.entries(laptop.quantities).map(([condition, quantity]) => (
                                    <p key={condition}>{condition}: {quantity}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
