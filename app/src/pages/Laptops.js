import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout/Layout";
import { useNavigate } from 'react-router-dom';


const Laptops = () => {
    const navigate = useNavigate();
    const [laptops, setLaptops] = useState([]);

    useEffect(() => {
        fetch('api/getAllAsignedLaptops.php') // Adjust this URL to your actual API endpoint
        .then(res => res.json())
        .then(response => {
            // Ensure response has 'success' flag and 'users' array
            if (response.success && response.laptops) {
                setLaptops(response.laptops);
            }
        })
        .catch(error => console.error("There was an error fetching the laptops:", error));
    }, []);
    return (
        <Layout>
            <div className="flex items-center p-4 bg-gray-100">
                <button className="flex flex-col items-center bg-yellow-500 text-white p-4  rounded-md" 
                onClick={() => navigate('/assignedLaptop')}
                >
                    <span className="text-lg">Assign Laptop</span>
                </button>
                <button className="flex flex-col items-center bg-blue-500 text-white p-4 ml-4 rounded-md"
                onClick={() => navigate('/addLaptops')}
                >
                  <span className="text-lg">Add Laptop</span>
                </button>
                <button className="flex flex-col items-center bg-green-500 text-white ml-4 p-4 rounded-md"
                onClick={() => navigate('/scrapMobiles')}
                >
                 <span className="text-lg">Scrap Laptops</span>
                   
                </button>
            </div>
            <div className="p-4">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Model</th>
                            <th className="py-2 px-4 border-b">MAC Address</th>
                            <th className="py-2 px-4 border-b">Serial Number</th>
                            <th className="py-2 px-4 border-b">Comment</th>
                            <th className="py-2 px-4 border-b">Created At</th>
                            <th className="py-2 px-4 border-b">Assigned To</th>
                            <th className="py-2 px-4 border-b">Condition</th>
                            <th className="py-2 px-4 border-b">Assigned By</th>
                            <th className="py-2 px-4 border-b">Signature Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {laptops.map((laptop) => (
                            <tr key={laptop.id}>
                                <td className="py-2 px-4 border-b">{laptop.id}</td>
                                <td className="py-2 px-4 border-b">{laptop.model}</td>
                                <td className="py-2 px-4 border-b">{laptop.macAddress}</td>
                                <td className="py-2 px-4 border-b">{laptop.serial_number}</td>
                                <td className="py-2 px-4 border-b">{laptop.comment}</td>
                                <td className="py-2 px-4 border-b">{new Date(laptop.created_at.date).toLocaleString()}</td>
                                <td className="py-2 px-4 border-b">{laptop.assignedTo}</td>
                                <td className="py-2 px-4 border-b">{laptop.condition}</td>
                                <td className="py-2 px-4 border-b">{laptop.assignedBy}</td>
                                <td className="py-2 px-4 border-b">
                                    <img src={laptop.signature_data} alt="Signature" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default Laptops;
