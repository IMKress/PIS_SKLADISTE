import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Table, Card, Row, Col, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function IzdatnicaLokacije() {
    const [nazivArhive, setNazivArhive] = useState('');
    const [napomena, setNapomena] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dokumenti, setDokumenti] = useState([]);
    const [filtriraniDokumenti, setFiltriraniDokumenti] = useState([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [userDetails, setUserDetails] = useState({ username: '', roles: [], UserId: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('Username');
        const roles = JSON.parse(localStorage.getItem('Role') || '[]');
        const UserId = localStorage.getItem('UserId');

        if (token) {
            setUserDetails({ username, roles, UserId });
        }
    }, []);

    // Učitaj dokumente
    useEffect(() => {
        const fetchDokumenti = async () => {
            try {
                const response = await axios.get("https://localhost:5001/api/home/joined_dokument_tip", {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                        console.log(response.data)

                setDokumenti(response.data);
            } catch (error) {
                console.error(error);
                alert("Greška prilikom učitavanja dokumenata");
            }
        };

        fetchDokumenti();
    }, []);

    // Filtriraj dokumente
    // Filtriraj dokumente koji nisu arhivirani
    const handleUcitajDokumente = () => {
        if (!startDate || !endDate) {
            alert("Molimo odaberite oba datuma.");
            return;
        }

        const filtrirani = dokumenti.filter(d => {
            const datum = new Date(d.datumDokumenta);
            return (
                datum >= new Date(startDate) &&
                datum <= new Date(endDate) &&
                (d.arhiviran === false || d.arhiviran === 0 || d.arhiviran === "0" || d.arhiviran === null)
            );
        });
        console.log(filtrirani)
        setFiltriraniDokumenti(filtrirani);
        setCurrentPage(1);
    };


    // Pagination logika
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtriraniDokumenti.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filtriraniDokumenti.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 🔹 NOVA FUNKCIJA: kreira arhivu i arhivira dokumente
    const handleKreirajIArhiviraj = async () => {
        if (!nazivArhive || !startDate || !endDate) {
            alert("Molimo unesite naziv arhive i datume.");
            return;
        }

        const potvrda = window.confirm("Jeste li sigurni da želite kreirati arhivu i arhivirati dokumente?");
        if (!potvrda) return;

        try {
            // 1️⃣ Kreiraj arhivu
            const arhivaObj = {
                datumArhive: new Date(),
                arhivaOznaka: `ARH-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
                arhivaNaziv: nazivArhive,
                napomena: napomena,
                arhiveStanja: []
            };

            const addResponse = await axios.post("https://localhost:5001/api/home/add_arhiva", arhivaObj, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            const createdArhivaId = addResponse.data.arhivaId || addResponse.data.ArhivaId;
            if (!createdArhivaId) {
                alert("Greška: API nije vratio ID arhive.");
                return;
            }

            // 2️⃣ Arhiviraj dokumente
            const arhivirajObj = {
                datumOd: startDate,
                datumDo: endDate,
                arhivaId: createdArhivaId
            };

            await axios.post("https://localhost:5001/api/home/arhiviraj-dokumente", arhivirajObj, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            alert("Arhiva uspješno kreirana i dokumenti arhivirani ✅");

            // Reset polja
            setNazivArhive('');
            setNapomena('');
            setStartDate('');
            setEndDate('');
            setFiltriraniDokumenti([]);
        } catch (error) {
            console.error("Greška prilikom kreiranja arhive:", error);
            alert("Došlo je do greške prilikom arhiviranja dokumenata.");
        }
    };

    return (
        <Container className="mt-5">
            <Card className="p-3">
                <Card.Body>
                    {/* Naziv arhive */}
                    <Form.Group className="mb-3">
                        <Form.Label>Naziv arhive</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite naziv arhive"
                            value={nazivArhive}
                            onChange={(e) => setNazivArhive(e.target.value)}
                        />
                    </Form.Group>

                    {/* Napomena */}
                    <Form.Group className="mb-3">
                        <Form.Label>Napomena</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Unesite napomenu..."
                            value={napomena}
                            onChange={(e) => setNapomena(e.target.value)}
                        />
                    </Form.Group>

                    {/* Datumi */}
                    <Form.Group className="mb-4">
                        <Form.Label>Razdoblje</Form.Label>
                        <Row>
                            <Col>
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </Form.Group>

                    {/* Dugmad */}
                    <div className="d-flex justify-content-between mt-4">
                        <Button
                            variant="info"
                            onClick={handleUcitajDokumente}
                            disabled={!startDate || !endDate}
                        >
                            Učitaj dokumente
                        </Button>

                        <Button
                            variant="success"
                            onClick={handleKreirajIArhiviraj}
                            disabled={!filtriraniDokumenti.length}
                        >
                            Kreiraj arhivu i arhiviraj dokumente
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => {
                                setNazivArhive('');
                                setNapomena('');
                                setStartDate('');
                                setEndDate('');
                                setFiltriraniDokumenti([]);
                            }}
                        >
                            Odustani
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Tabela dokumenata */}
            <h3 className="mt-4">Dokumenti u odabranom razdoblju</h3>
            <Table striped bordered hover variant="light">
                <thead>
                    <tr>
                        <th>Oznaka dokumenta</th>
                        <th>Tip dokumenta</th>
                        <th>Datum dokumenta</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((dok, index) => (
                            <tr key={index}>
                                <td>{dok.oznakaDokumenta}</td>
                                <td>{dok.tipDokumenta}</td>
                                <td>{new Date(dok.datumDokumenta).toLocaleDateString('hr-HR')}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center text-muted">
                                Nema dokumenata u odabranom razdoblju.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Paginacija */}
            {filtriraniDokumenti.length > itemsPerPage && (
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
        </Container>
    );
}

export default IzdatnicaLokacije;
