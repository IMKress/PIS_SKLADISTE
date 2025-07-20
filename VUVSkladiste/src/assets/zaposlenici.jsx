import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Container } from 'react-bootstrap';
import axios from 'axios';
import { InfoModal, AddEmployeeModal } from './modals';  // Assuming the modals are in the same folder

function Zaposlenici() {
    const [users, setUsers] = useState([]);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState('');
    const [selectedFirstName, setSelectedFirstName] = useState('');
    const [selectedLastName, setSelectedLastName] = useState('');

    // Fetch all usernames from API
    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://localhost:5001/api/home/usernames');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle "Info" button click
    const handleShowInfo = (userId, userName, firstName, lastName) => {
        setSelectedUserId(userId);
        setSelectedUserName(userName);
        setSelectedFirstName(firstName);
        setSelectedLastName(lastName);
        setShowInfoModal(true);
    };

    // Handle "Add Employee" button click
    const handleShowAddModal = () => {
        setShowAddModal(true);
    };

    // Close modals and refresh data after update or addition
    const handleCloseModals = () => {
        setShowInfoModal(false);
        setShowAddModal(false);
        fetchUsers(); // Refresh data after closing modals
    };

    return (
        <div >
            <Container>

                <Button
                    variant="secondary"
                    onClick={handleShowAddModal}
                   
                >
                    Dodaj zaposlenika
                </Button>
                <Card className="form-card" style={{ maxWidth: '800px', margin: '20px auto' }}>

                    <Card.Header className="text-light" as="h4">Narudžbenice u isporuci</Card.Header>
                    <Card.Body>


                        <Table className="centered-table mt-3" striped bordered hover variant="light" style={{ width: '60%' }}>
                            <thead>
                                <tr>
                                    <th>Korisničko ime</th>
                                    <th>Info</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.item1}>
                                        <td>{user.item2}</td>
                                        <td>
                                            <Button
                                                variant="info"
                                                onClick={() => handleShowInfo(user.item1, user.item2, "FirstName", "LastName")}
                                            >
                                                Info
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
                {/* Info Modal */}
                <InfoModal
                    show={showInfoModal}
                    handleClose={handleCloseModals}
                    userId={selectedUserId}
                    userName={selectedUserName}
                    firstName={selectedFirstName}
                    lastName={selectedLastName}
                    onUpdate={fetchUsers}  // To refresh data after update
                />

                {/* Add Employee Modal */}
                <AddEmployeeModal
                    show={showAddModal}
                    handleClose={handleCloseModals}
                    onAdd={fetchUsers}  // To refresh data after adding
                />
            </Container>

        </div>
    );
}

export default Zaposlenici;
