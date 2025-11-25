import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import { Button, Card, Form, Row, Col, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Narudzbenice() {
    const baseURL = "https://localhost:5001/api/home/joined_narudzbenice";

    const [narudzbenice, setNarudzbenice] = useState([]);
    const [filteredNarudzbenice, setFilteredNarudzbenice] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [usernames, setUsernames] = useState({});
    const [dobavljaci, setDobavljaci]= useState({});
    const [statusi, setStatusi] = useState({});
    const [rokovi, setRokovi] = useState({});
    const [filterStatus, setFilterStatus] = useState("sve");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

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
        })
            .then(response => {
                const nonArchived = response.data.filter(n => !isArhiviran(n.arhiviran));
                setNarudzbenice(nonArchived);
                setFilteredNarudzbenice(nonArchived);

                const uniqueIds = [...new Set(nonArchived.map(n => n.zaposlenikId))];
                uniqueIds.forEach(id => fetchUsername(id));
                nonArchived.forEach(n => {
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
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const rok = response.data?.rokIsporuke;
            setRokovi(prev => ({ ...prev, [dokumentId]: rok }));
        } catch (err) {
            console.error(`Greška pri dohvaćanju roka isporuke za dokument ${dokumentId}`, err);
        }
    };

    useEffect(() => {
        let filtered = narudzbenice.filter(n => !isArhiviran(n.arhiviran));

        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            filtered = filtered.filter(art => {
                const datumGB = new Date(art.datumDokumenta).toLocaleDateString('en-GB', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                });
                const datumHR = new Date(art.datumDokumenta).toLocaleDateString('hr-HR');
                const status = statusi[art.dokumentId]?.toLowerCase() || '';
                const zaposlenik = (usernames[art.zaposlenikId] || '').toLowerCase();
                const dobavljacNaziv = (art.dobavljacNaziv || '').toLowerCase();

                return (
                    art.dokumentId.toString().includes(term) ||
                    (art.oznakaDokumenta || '').toLowerCase().includes(term) ||
                    datumGB.toLowerCase().includes(term) ||
                    datumHR.toLowerCase().includes(term) ||
                    status.includes(term) ||
                    zaposlenik.includes(term) ||
                    dobavljacNaziv.includes(term)
                );
            });
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
        setCurrentPage(1);
    }, [searchTerm, narudzbenice, filterStatus, statusi, usernames, startDate, endDate]);

    const handleShowInfoPage = (dokumentId) => {
        navigate(`/narudzbenica/${dokumentId}`);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredNarudzbenice.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredNarudzbenice.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                                <th>Dostavljač</th>
                                <th>Status</th>
                                <th>Rok isporuke</th>
                                <th>Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? currentItems.map((art, index) => {
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
                                        <td>{[art.dobavljacNaziv]|| <span className="text-muted">Učitavanje...</span>}</td>
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
                            }) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted">
                                        Nema dostupnih narudžbenica.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    {filteredNarudzbenice.length > itemsPerPage && (
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

            </Card >
        </>

    );
}

export default Narudzbenice;