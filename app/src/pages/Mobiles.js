import React from 'react';
import Layout from "../components/Layout/Layout";
import { useNavigate } from 'react-router-dom';

const Mobiles = () => {
    const navigate = useNavigate();
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
        </Layout>
    );
}

export default Mobiles;
