import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Layout from "../components/Layout/Layout";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { useSession } from "../globalStates/session.state";
import { useNavigate } from "react-router-dom";
import SignatureCanvas from 'react-signature-canvas';

const AssignedMobile = () => {
    const navigate = useNavigate();
    const [sessionState, sessionAction] = useSession();
    const [formData, setFormData] = useState({
        model: '',
        condition: '', 
        imei: '',
        serial_number: '',
        comment: '',
        assignedTo: '',
        mobileHistory: sessionState.name
    });
    const [userOptions, setUserOptions] = useState([]);
    const signatureCanvasRef = useRef(null);

    useEffect(() => {
        if (!sessionState.name) {
            axios.post(`api/Layout/get_session_data.php`).then(res => {
                if (res.data.errors === 0) {
                    sessionAction.setSession(res.data.session_data);
                } else {
                    navigate("/login");
                }
            });
        }

        axios.get(`api/GetAllUsers.php`)
            .then(res => {
                if (res.data.success && Array.isArray(res.data.users)) {
                    setUserOptions(res.data.users.map(user => user.email));
                }
            })
            .catch(err => console.error("Failed to fetch users:", err));
    }, [sessionAction, navigate, sessionState.name]);

    const handleChange = (event, value, fieldName) => {
        if (fieldName) {
            setFormData({ ...formData, [fieldName]: value });
        } else if (event.target.name && event.target.value !== undefined) {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const handleClearSignature = () => {
        signatureCanvasRef.current.clear();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const signatureData = signatureCanvasRef.current.toDataURL();
            const formDataWithSignature = { ...formData, signature: signatureData };
    
            const response = await axios.post(
                'api/addAssignedMobile.php', 
                formDataWithSignature,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            console.log('Form Data Submitted:', formDataWithSignature);
    
            if (response.data.success) {
                alert('Submission Successful');
                setFormData({
                    model: '',
                    condition: '', 
                    imei: '',
                    serial_number: '',
                    comment: '',
                    assignedTo: '',
                    mobileHistory: sessionState.name
                });
                signatureCanvasRef.current.clear();
            } else if (response.data.error) {
                alert('Submission Failed: ' + response.data.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again later.');
        }
    };

    const models = ['Samsung A54', 'iPhone SE', 'Samsung A53', 'Samsung Tab S8', 'Samsung A55', 'Samsung S24', 'Samsung S23'];
    const conditions = ['New', 'Used'];

    return (
        <Layout>
            <h1 className="text-center font-semibold p-3 text-4xl">Assign mobile</h1>
            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                    <div className="w-full px-3 mb-6">
                        <Autocomplete
                            freeSolo
                            options={userOptions}
                            value={formData.assignedTo}
                            onChange={(event, newValue) => {
                                handleChange(event, newValue, 'assignedTo');
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Assigned To"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    </div>
                    <div className="w-full px-3 mb-6">
                        <Autocomplete
                            freeSolo
                            options={models}
                            value={formData.model}
                            onChange={(event, newValue) => {
                                handleChange(event, newValue, 'model');
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Model"
                                    variant="outlined"
                                    name="model"
                                    fullWidth
                                    required
                                />
                            )}
                        />
                    </div>
                    <div className="w-full px-3 mb-6">
                        <Autocomplete
                            freeSolo
                            options={conditions}
                            value={formData.condition}
                            onChange={(event, newValue) => {
                                handleChange(event, newValue, 'condition');
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Condition"
                                    variant="outlined"
                                    name="condition"
                                    fullWidth
                                    required
                                />
                            )}
                        />
                    </div>
                    <div className="w-full px-3 mb-6">
                        <TextField
                            label="IMEI"
                            variant="outlined"
                            name="imei"
                            value={formData.imei}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="w-full px-3 mb-6">
                        <TextField
                            label="Serial Number"
                            variant="outlined"
                            name="serial_number"
                            value={formData.serial_number}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="w-full px-3 mb-6">
                        <TextField
                            label="Comment"
                            variant="outlined"
                            name="comment"
                            multiline
                            rows={4}
                            value={formData.comment}
                            onChange={handleChange}
                            fullWidth
                        />
                    </div>
                    <div className="w-full px-3">
                        <SignatureCanvas
                            ref={signatureCanvasRef}
                            penColor="black"
                            canvasProps={{ width: 300, height: 150, className: 'signature-canvas border-2 border-black' }}
                        />
                        <Button variant="contained" onClick={handleClearSignature}>
                            Clear
                        </Button>
                    </div>
                    <div className="flex justify-center mt-6 mb-6">
                        <Button variant="contained" type="submit" color="primary">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default AssignedMobile;
