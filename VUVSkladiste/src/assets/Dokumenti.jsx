import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import { Button, Card, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Dokumenti() {
    const baseURL = "https://localhost:5001/api/home/joined_dokument_tip";
    const [artikli, setArtikli] = useState([]);
    const [filteredArtikli, setFilteredArtikli] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios({
            method: 'get',
            url: baseURL,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response => {
            setArtikli(response.data);
            setFilteredArtikli(response.data);
        }).catch(error => {
            console.error(error);
            alert("Greška prilikom učitavanja podataka");
        });
    }, []);

    useEffect(() => {
        let filtered = artikli;

        // ✅ Isključi Narudžbenice uvijek
        filtered = filtered.filter(art => art.tipDokumenta !== "Narudzbenica");

        if (filterType !== "all") {
            filtered = filtered.filter(art => art.tipDokumenta === filterType);
        }

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
        navigate(`/dokument-info/${dokumentId}`);
    };

    return (
        <>
            <div className="d-flex justify-content-center mt-4 gap-2">
                <Button
                    variant={filterType === "all" ? "primary" : "info"}
                    onClick={() => setFilterType("all")}
                >
                    Sve
                </Button>
                <Button
                    variant={filterType === "Primka" ? "primary" : "info"}
                    onClick={() => setFilterType("Primka")}
                >
                    Primke
                </Button>
                <Button
                    variant={filterType === "Izdatnica" ? "primary" : "info"}
                    onClick={() => setFilterType("Izdatnica")}
                >
                    Izdatnice
                </Button>
            </div>
            <Card className="form-card">
                <Card.Header className="text-light" as="h4">Popis Dokumenata</Card.Header>

                <Card.Body>


                    <Form.Group controlId="searchDokument" className="mt-3" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Form.Control
                            type="text"
                            placeholder="Pretraži po Šifri ili Nazivu..."
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
                                <th>Tip dokumenta</th>
                                <th>Datum dokumenta</th>
                                <th>Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredArtikli.map((art, index) => (
                                    <tr key={index}>
                                        <td>{art.oznakaDokumenta}</td>
                                        <td>{art.tipDokumenta}</td>
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

export default Dokumenti;
