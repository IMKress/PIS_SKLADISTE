import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import { Button, Card, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Otpisi() {
    const baseURL = "https://localhost:5001/api/home/get_all_otpis_joined";
    const [artikli, setArtikli] = useState([]);
    const [filteredArtikli, setFilteredArtikli] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();

    const isArhiviran = (value) =>
        value === true ||
        value === 1 ||
        value === "1" ||
        value === "true" ||
        value === "True";

    useEffect(() => {
        axios({
            method: 'get',
            url: baseURL,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response => {
            const nonArchived = response.data.filter(art => !isArhiviran(art.arhiviran));
            setArtikli(nonArchived);
            setFilteredArtikli(nonArchived);
            console.log(response.data)
        }).catch(error => {
            console.error(error);
            alert("Greška prilikom učitavanja podataka");
        });
    }, []);

    useEffect(() => {
        let filtered = artikli.filter(art => !isArhiviran(art.arhiviran));



        if (searchTerm) {
            filtered = filtered.filter(art =>
                art.dokumentId.toString().includes(searchTerm) ||
                art.tipDokumenta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                new Date(art.datumDokumenta).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }).includes(searchTerm)
            );
        }

        if (startDate) {
            filtered = filtered.filter(art => new Date(art.datumDokumenta) >= new Date(startDate));
        }

        if (endDate) {
            filtered = filtered.filter(art => new Date(art.datumDokumenta) <= new Date(endDate));
        }

        setFilteredArtikli(filtered);
    }, [filterType, searchTerm, artikli, startDate, endDate]);

    const handleInfoClick = (dokumentId) => {
        navigate(`/OtpisDokumentInfo/${dokumentId}`); //TODO OTPIS INFO NAPRAVITI
    };

    return (
        <>
            
            <Card className="form-card">
                <Card.Header className="text-light" as="h4">Popis Otpisa</Card.Header>

                <Card.Body>
                    <Form.Group controlId="searchDokument" className="mt-3" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Form.Control
                            type="text"
                            placeholder="Pretraži...."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '80%' }}
                        />
                    </Form.Group>

                    <Row className="mt-2" style={{ width: '80%', margin: '0 auto' }}>
                        <Col>
                            <Form.Control type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        </Col>
                        <Col>
                            <Form.Control type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        </Col>
                    </Row>

                    <Table className="centered-table mt-3" striped bordered hover variant="light">
                        <thead>
                            <tr>
                                <th>Oznaka Dokumenta</th>
                                <th>Datum dokumenta</th>
                                <th>Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredArtikli.map((art, index) => (
                                    <tr key={index}>
                                        <td>{art.oznakaDokumenta}</td>
                                        <td>{new Date(art.datumDokumenta).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}</td>
                                        <td>
                                            <Button
                                                variant="info"
                                                onClick={() => handleInfoClick(art.dokumentId)}
                                                size="sm"
                                            >
                                                Detalji
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                        
                    </Table>
                </Card.Body>
            </Card>
        </>
    );
}

export default Otpisi;
