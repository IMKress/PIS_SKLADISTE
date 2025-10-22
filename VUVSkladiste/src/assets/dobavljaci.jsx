import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import { Form, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { API_URLS } from "../API_URL/getApiUrl";
function Dobavljaci() {
    const [dobavljaci, setDobavljaci] = useState([]);
    const [filteredDobavljaci, setFilteredDobavljaci] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        axios({
            method: 'get',
            url: API_URLS.gAllDobavljaci,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setDobavljaci(response.data);
                setFilteredDobavljaci(response.data);
            })
            .catch(error => {
                console.error(error);
                alert("Greška prilikom učitavanja dobavljača");
            });
    }, []);

    useEffect(() => {
        let filtered = dobavljaci;

        if (searchTerm) {
            filtered = filtered.filter(d =>
                d.dobavljacNaziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.adresaDobavljaca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.brojTelefona.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (d.email && d.email.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredDobavljaci(filtered);
    }, [searchTerm, dobavljaci]);

    const handleShowDokumenti = (dobavljacId) => {
        navigate(`/dobavljac/${dobavljacId}/dokumenti`);
    };

    return (
        <>
            <Container>
                <Button
                    className="small-button-Stanja me-2"
                    onClick={() => navigate("/dobavljaci/novi")}
                    variant="info"
                    size="sm"
                >
                    Dodaj dobavljača
                </Button>

                <Card className="form-card">
                    <Card.Header className="text-light" as="h4">Popis Dobavljača</Card.Header>
                    <Card.Body>

                        <Form.Group controlId="searchDobavljac" className="mt-3" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <Form.Control
                                type="text"
                                placeholder="Pretraži po nazivu, adresi ili telefonu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '80%' }}
                            />
                        </Form.Group>

                        <Table className="centered-table mt-3" striped bordered hover variant="light">
                            <thead>
                                <tr>
                                    <th>Naziv</th>
                                    <th>Adresa</th>
                                    <th>Telefon</th>
                                    <th>Email</th>
                                    <th>Dokumenti</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredDobavljaci.map((d, index) => (
                                    <tr key={index}>
                                        <td>{d.dobavljacNaziv}</td>
                                        <td>{d.adresaDobavljaca}</td>
                                        <td>{d.brojTelefona}</td>
                                        <td>{d.email}</td>
                                        <td>
                                            <button
                                                className="btn btn-info btn-sm"
                                                onClick={() => handleShowDokumenti(d.dobavljacId)}
                                            >
                                                Prikaži
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

export default Dobavljaci;
