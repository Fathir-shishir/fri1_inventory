import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout/Layout";
import { useNavigate } from 'react-router-dom';

const Mobiles = () => {
    const navigate = useNavigate();
    const [mobiles, setMobiles] = useState([]);

    useEffect(() => {
        fetch('api/getAllMobiles.php') // Adjust this URL to your actual API endpoint
        .then(res => res.json())
        .then(response => {
            // Ensure response has 'success' flag and 'users' array
            if (response.success && response.mobiles) {
                setMobiles(response.mobiles);
            }
        })
        .catch(error => console.error("There was an error fetching the mobiles:", error));
    }, []);
    return (
        <Layout>
            <div className="flex items-center p-4 bg-gray-100">
                <button className="flex flex-col items-center bg-yellow-500 text-white p-4  rounded-md" 
                onClick={() => navigate('/assignedMobile')}
                >
                    <span className="text-lg">Assign mobile</span>
                </button>
                <button className="flex flex-col items-center bg-blue-500 text-white p-4 ml-4 rounded-md"
                onClick={() => navigate('/storeMobile')}
                >
                  <span className="text-lg">Add Mobile</span>
                </button>
                <button className="flex flex-col items-center bg-green-500 text-white ml-4 p-4 rounded-md"
                onClick={() => navigate('/scrapMobiles')}
                >
                 <span className="text-lg">Scrap Mobiles</span>
                   
                </button>
            </div>

            <div className="p-4">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Model</th>
                            <th className="py-2 px-4 border-b">IMEI</th>
                            <th className="py-2 px-4 border-b">Serial Number</th>
                            <th className="py-2 px-4 border-b">Comment</th>
                            <th className="py-2 px-4 border-b">Created At</th>
                            <th className="py-2 px-4 border-b">Assigned To</th>
                            <th className="py-2 px-4 border-b">Condition</th>
                            <th className="py-2 px-4 border-b">Signature Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mobiles.map((mobile) => (
                            <tr key={mobile.id}>
                                <td className="py-2 px-4 border-b">{mobile.id}</td>
                                <td className="py-2 px-4 border-b">{mobile.model}</td>
                                <td className="py-2 px-4 border-b">{mobile.imei}</td>
                                <td className="py-2 px-4 border-b">{mobile.serial_number}</td>
                                <td className="py-2 px-4 border-b">{mobile.comment}</td>
                                <td className="py-2 px-4 border-b">{new Date(mobile.created_at.date).toLocaleString()}</td>
                                <td className="py-2 px-4 border-b">{mobile.assignedTo}</td>
                                <td className="py-2 px-4 border-b">{mobile.condition}</td>
                                <td className="py-2 px-4 border-b">
                                    <img src={mobile.signature_data} alt="Signature" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default Mobiles;
