import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import { Button, Card, Form, ButtonGroup, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Narudzbenice() {
    const baseURL = "https://localhost:5001/api/home/joined_narudzbenice";

    const [narudzbenice, setNarudzbenice] = useState([]);
    const [filteredNarudzbenice, setFilteredNarudzbenice] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [usernames, setUsernames] = useState({});
    const [statusi, setStatusi] = useState({});
    const [rokovi, setRokovi] = useState({});
    const [filterStatus, setFilterStatus] = useState("sve");

    const navigate = useNavigate();

    useEffect(() => {
        axios({
            method: 'get',
            url: baseURL,
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(response => {
                setNarudzbenice(response.data);
                setFilteredNarudzbenice(response.data);

                const uniqueIds = [...new Set(response.data.map(n => n.zaposlenikId))];
                uniqueIds.forEach(id => fetchUsername(id));
                response.data.forEach(n => {
                    fetchStatus(n.dokumentId);
                    fetchRok(n.dokumentId);
                });
            })
            .catch(error => {
                console.error(error);
                alert("Greška prilikom učitavanja narudžbenica");
            });
    }, []);

    const fetchUsername = async (userId) => {
        if (!userId || usernames[userId]) return;

        try {
            const response = await axios.get(`https://localhost:5001/api/home/username/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            setUsernames(prev => ({
                ...prev,
                [userId]: response.data.userName
            }));
        } catch (error) {
            console.error(`Greška pri dohvaćanju username za korisnika ${userId}`, error);
            setUsernames(prev => ({
                ...prev,
                [userId]: "Nepoznato"
            }));
        }
    };

    const fetchStatus = async (dokumentId) => {
        try {
            const response = await axios.get(`https://localhost:5001/api/home/statusi_dokumenata_by_dokument/${dokumentId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            const aktivni = response.data.find(
                s => s.aktivan === true || s.aktivan === 1 || s.Aktivan === true || s.Aktivan === 1
            );
            const latest = response.data[response.data.length - 1];
            const naziv = aktivni?.statusNaziv || aktivni?.StatusNaziv || latest?.statusNaziv || latest?.StatusNaziv || "Nepoznat";
            setStatusi(prev => ({ ...prev, [dokumentId]: naziv }));
        } catch (err) {
            console.error(`Greška pri dohvaćanju statusa za dokument ${dokumentId}`, err);
            setStatusi(prev => ({ ...prev, [dokumentId]: "Nepoznat" }));
        }
    };

    const fetchRok = async (dokumentId) => {
        try {
            const response = await axios.get(`https://localhost:5001/api/home/narudzbenica_detalji/${dokumentId}`, {
                headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
            });
            const rok = response.data?.rokIsporuke;
            setRokovi(prev => ({ ...prev, [dokumentId]: rok }));
        } catch (err) {
            console.error(`Greška pri dohvaćanju roka isporuke za dokument ${dokumentId}`, err);
        }
    };

    useEffect(() => {
        let filtered = narudzbenice;

        if (searchTerm) {
            filtered = filtered.filter(art =>
                art.dokumentId.toString().includes(searchTerm) ||
                new Date(art.datumDokumenta).toLocaleDateString('en-GB', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                }).includes(searchTerm)
            );
        }

        if (startDate) {
            filtered = filtered.filter(art => new Date(art.datumDokumenta) >= new Date(startDate));
        }

        if (endDate) {
            filtered = filtered.filter(art => new Date(art.datumDokumenta) <= new Date(endDate));
        }

        if (filterStatus !== "sve") {
            filtered = filtered.filter(n => {
                const status = statusi[n.dokumentId]?.toLowerCase();
                return filterStatus === "otvorene"
                    ? status !== "zatvorena" && status !== "zatvoren"
                    : status === "zatvorena" || status === "zatvoren";
            });
        }

        setFilteredNarudzbenice(filtered);
    }, [searchTerm, narudzbenice, filterStatus, statusi, startDate, endDate]);

    const handleShowInfoPage = (dokumentId) => {
        navigate(`/narudzbenica/${dokumentId}`);
    };

    return (
        <>

            <div className="d-flex justify-content-center mt-4 gap-2">
                <Button
                    variant={filterStatus === "sve" ? "primary" : "info"}
                    onClick={() => setFilterStatus("sve")}
                >
                    Sve
                </Button>
                <Button
                    variant={filterStatus === "otvorene" ? "primary" : "info"}
                    onClick={() => setFilterStatus("otvorene")}
                >
                    Otvorene
                </Button>
                <Button
                    variant={filterStatus === "zatvorene" ? "primary" : "info"}
                    onClick={() => setFilterStatus("zatvorene")}
                >
                    Zatvorene
                </Button>
            </div>

            <Card className="form-card">
                <Card.Header className="text-light" as="h4">Popis Narudžbenica</Card.Header>
                <Card.Body>

                    <Form.Group controlId="searchNarudzbenica" className="mt-3" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Form.Control
                            type="text"
                            placeholder="Pretraži po Šifri ili Datumu..."
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
                                <th>Id dokumenta</th>
                                <th>Datum dokumenta</th>
                                <th>Tip dokumenta</th>
                                <th>Kreirao</th>
                                <th>Status</th>
                                <th>Rok isporuke</th>
                                <th>Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredNarudzbenice.map((art, index) => {
                                const rok = rokovi[art.dokumentId] ? new Date(rokovi[art.dokumentId]) : null;
                                let rowClass = '';
                                const statusNaziv = statusi[art.dokumentId]?.toLowerCase();
                                if (rok && statusNaziv === 'isporuka') {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const rokDate = new Date(rok);
                                    rokDate.setHours(0, 0, 0, 0);
                                    if (rokDate.getTime() === today.getTime()) rowClass = 'table-warning';
                                    else if (rokDate < today) rowClass = 'table-danger';
                                }
                                return (
                                    <tr key={index} className={rowClass}>
                                        <td>{art.oznakaDokumenta}</td>
                                        <td>{new Date(art.datumDokumenta).toLocaleDateString('en-GB', {
                                            day: '2-digit', month: '2-digit', year: 'numeric'
                                        })}</td>
                                        <td>{art.tipDokumenta}</td>
                                        <td>{usernames[art.zaposlenikId] || <span className="text-muted">Učitavanje...</span>}</td>
                                        <td>{statusi[art.dokumentId] || <span className="text-muted">Učitavanje...</span>}</td>
                                        <td>{rok ? new Date(rok).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}</td>
                                        <td>
                                            <Button
                                                variant="info"
                                                onClick={() => handleShowInfoPage(art.dokumentId)}
                                                size="sm"
                                            >
                                                Detalji
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Card.Body>

            </Card >
        </>

    );
}

export default Narudzbenice;