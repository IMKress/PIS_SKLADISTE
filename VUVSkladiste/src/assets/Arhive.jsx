import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import { Button, Card, Form, Row, Col, Container, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Arhive() {
    const baseURL = "https://localhost:5001/api/home/get_all_arhive";
    const artikliURL = "https://localhost:5001/api/home/ukupnaarhiviranastanjaview";

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [viewMode, setViewMode] = useState("arhive"); // "arhive" | "artikli"
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, [viewMode]);

    const loadData = () => {
        const url = viewMode === "arhive" ? baseURL : artikliURL;

        axios({
            method: 'get',
            url,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response => {
            setData(response.data);
            setFilteredData(response.data);
            setCurrentPage(1);
        }).catch(error => {
            console.error(error);
            alert("Greška prilikom učitavanja podataka");
        });
    };

    useEffect(() => {
        let filtered = data;

        if (viewMode === "arhive") {
            // filtriranje arhiva
            if (searchTerm) {
                filtered = filtered.filter(art =>
                    art.arhivaOznaka.toString().includes(searchTerm) ||
                    art.arhivaNaziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    new Date(art.datumArhive).toLocaleDateString('en-GB').includes(searchTerm)
                );
            }

            if (startDate) {
                filtered = filtered.filter(art => new Date(art.datumDokumenta) >= new Date(startDate));
            }

            if (endDate) {
                filtered = filtered.filter(art => new Date(art.datumDokumenta) <= new Date(endDate));
            }
        } else {
            // filtriranje artikala
            if (searchTerm) {
                filtered = filtered.filter(art =>
                    art.artiklOznaka.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    art.artiklNaziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    art.kategorijaNaziv.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
        }

        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, startDate, endDate, data, viewMode]);

    const handleInfoClick = (arhivaId) => {
        navigate(`/ArhivaInfo/${arhivaId}`);
    };
    const handleDodajArhivu = () => {
        navigate(`/ArhivaNova`);
    };
    const toggleView = () => {
        setViewMode(viewMode === "arhive" ? "artikli" : "arhive");
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-3">
                {viewMode === "arhive" && (
                    <Button
                        variant="success"
                        className="small-button-Stanja me-2"
                        onClick={() => handleDodajArhivu()}
                        size="sm"
                    >
                        Napravi arhivu
                    </Button>
                )}
                <Button
                    variant={viewMode === "arhive" ? "primary" : "secondary"}
                    onClick={toggleView}
                    size="sm"
                >
                    {viewMode === "arhive" ? "Prikaži artikle" : "Prikaži arhive"}
                </Button>
            </div>

            <Card className="form-card">
                <Card.Header className="text-light" as="h4">
                    {viewMode === "arhive" ? "Popis Arhiva" : "Pregled Artikala"}
                </Card.Header>

                <Card.Body>
                    <Form.Group controlId="searchDokument" className="mt-3" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Form.Control
                            type="text"
                            placeholder="Pretraži..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '80%' }}
                        />
                    </Form.Group>

                    {viewMode === "arhive" && (
                        <Row className="mt-2" style={{ width: '80%', margin: '0 auto' }}>
                            <Col>
                                <Form.Control type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                            </Col>
                            <Col>
                                <Form.Control type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                            </Col>
                        </Row>
                    )}

                    {/* 🔹 Tablica arhiva */}
                    {viewMode === "arhive" ? (
                        <Table className="centered-table mt-3" striped bordered hover variant="light">
                            <thead>
                                <tr>
                                    <th>Oznaka Arhive</th>
                                    <th>Naziv Arhive</th>
                                    <th>Datum dokumenta</th>
                                    <th>Napomena</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((art) => (
                                        <tr key={art.arhivaId}>
                                            <td>{art.arhivaOznaka}</td>
                                            <td>{art.arhivaNaziv}</td>
                                            <td>{new Date(art.datumArhive).toLocaleDateString('en-GB')}</td>
                                            <td>{art.napomena}</td>
                                            <td>
                                                <Button
                                                    variant="info"
                                                    onClick={() => handleInfoClick(art.arhivaId)}
                                                    size="sm"
                                                >
                                                    Detalji
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">
                                            Nema dostupnih arhiva.
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </Table>
                    ) : (
                        /* 🔹 Tablica artikala */
                        <Table className="centered-table mt-3" striped bordered hover variant="light">
                            <thead>
                                <tr>
                                    <th>Oznaka</th>
                                    <th>Naziv</th>
                                    <th>Jmj</th>
                                    <th>Kategorija</th>
                                    <th>Stanje</th>
                                    <th>Cijena</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((art, index) => (
                                        <tr key={index}>
                                            <td>{art.artiklOznaka}</td>
                                            <td>{art.artiklNaziv}</td>
                                            <td>{art.artiklJmj}</td>
                                            <td>{art.kategorijaNaziv}</td>
                                            <td>{art.stanje}</td>
                                            <td>
                                                {typeof art.cijena === "number" && !isNaN(art.cijena)
                                                    ? art.cijena.toFixed(2)
                                                    : "0.00"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted">
                                            Nema dostupnih artikala u arhivi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                    {filteredData.length > itemsPerPage && (
                        <Pagination className="justify-content-center">
                            <Pagination.Prev
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                            {[...Array(totalPages)].map((_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === currentPage}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Arhive;
