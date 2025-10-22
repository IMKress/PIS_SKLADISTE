import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Table, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../API_URL/getApiUrl';

function NoviOtpis() {
    const [primke, setPrimke] = useState([]);
    const [selectedPrimkaId, setSelectedPrimkaId] = useState('');
    const [primkaArtikli, setPrimkaArtikli] = useState([]);
    const [selectedArtikl, setSelectedArtikl] = useState('');
    const [kolicina, setKolicina] = useState('');
    const [datumIzdatnice, setDatumIzdatnice] = useState(new Date());
    const [dodaniArtikli, setDodaniArtikli] = useState([]);
    const [dokumentId, setDokumentId] = useState('');
    const [raspolozivaKolicina, setRaspolozivaKolicina] = useState(0);

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

    useEffect(() => {
        const fetchPrimke = async () => {
            try {
                const response = await axios.get(API_URLS.gJoinedDokTip(), {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const primkaDokumenti = response.data.filter(doc => {
                    const tipId = parseInt(doc.tipDokumentaId, 10);
                    return doc.tipDokumenta === 'Primka' || tipId === 1;
                });
                setPrimke(primkaDokumenti);
            } catch (error) {
                console.error(error);
                alert("Greška prilikom učitavanja primki");
            }
        };

        fetchPrimke();
    }, []);

    useEffect(() => {
        const fetchArtikliZaPrimku = async () => {
            setSelectedArtikl('');
            setKolicina('');
            setRaspolozivaKolicina(0);

            if (!selectedPrimkaId) {
                setPrimkaArtikli([]);
                return;
            }

            try {
                const response = await axios.get(API_URLS.gArtikliByDokument(selectedPrimkaId), {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const mapped = response.data.map(art => ({
                    ...art,
                    dostupnaKolicina: art.trenutnaKolicina ?? art.kolicina ?? 0
                }));
                setPrimkaArtikli(mapped);
            } catch (error) {
                console.error(error);
                alert("Greška prilikom učitavanja artikala primke");
                setPrimkaArtikli([]);
            }
        };

        fetchArtikliZaPrimku();
    }, [selectedPrimkaId]);

    useEffect(() => {
        if (!selectedArtikl || !selectedPrimkaId) {
            setRaspolozivaKolicina(0);
            return;
        }

        const artikl = primkaArtikli.find(a => a.artiklId === parseInt(selectedArtikl));
        if (!artikl) {
            setRaspolozivaKolicina(0);
            return;
        }

        const vecDodano = dodaniArtikli
            .filter(a => a.artiklId === artikl.artiklId && a.izDokumentaId === parseInt(selectedPrimkaId))
            .reduce((acc, item) => acc + item.kolicina, 0);

        const dostupno = Math.max((artikl.dostupnaKolicina ?? 0) - vecDodano, 0);
        setRaspolozivaKolicina(dostupno);
    }, [selectedArtikl, selectedPrimkaId, primkaArtikli, dodaniArtikli]);


    const handleAddArtikl = () => {
        if (!selectedPrimkaId) {
            alert("Odaberite primku.");
            return;
        }

        const artikl = primkaArtikli.find(a => a.artiklId === parseInt(selectedArtikl));
        if (!artikl || !kolicina) {
            alert("Popunite sva polja.");
            return;
        }

        const kolicinaNum = parseFloat(kolicina);
        if (Number.isNaN(kolicinaNum) || kolicinaNum <= 0) {
            alert("Količina mora biti veća od 0.");
            return;
        }

        if (kolicinaNum > raspolozivaKolicina) {
            alert(`Maksimalna količina za ovaj artikl je ${raspolozivaKolicina}.`);
            return;
        }

        const primka = primke.find(p => p.dokumentId === parseInt(selectedPrimkaId));
        const oznakaPrimke = primka?.oznakaDokumenta || `Primka #${selectedPrimkaId}`;
        const dokumentIdPrimke = parseInt(selectedPrimkaId);

        const postojećiIndex = dodaniArtikli.findIndex(a =>
            a.artiklId === artikl.artiklId && a.izDokumentaId === dokumentIdPrimke
        );

        if (postojećiIndex !== -1) {
            const novi = [...dodaniArtikli];
            novi[postojećiIndex] = {
                ...novi[postojećiIndex],
                kolicina: novi[postojećiIndex].kolicina + kolicinaNum
            };
            setDodaniArtikli(novi.map((a, i) => ({ ...a, redniBroj: i + 1 })));
        } else {
            const novi = {
                redniBroj: dodaniArtikli.length + 1,
                artiklId: artikl.artiklId,
                artiklOznaka: artikl.artiklOznaka,
                artiklNaziv: artikl.artiklNaziv,
                kolicina: kolicinaNum,
                izDokumentaId: dokumentIdPrimke,
                izDokumentaOznaka: oznakaPrimke,
            };

            setDodaniArtikli(prev => [...prev, novi]);
        }

        setKolicina('');
        setSelectedArtikl('');
    };

    const handleRemoveArtikl = (rb) => {
        const novi = dodaniArtikli.filter(a => a.redniBroj !== rb)
            .map((a, i) => ({ ...a, redniBroj: i + 1 }));
        setDodaniArtikli(novi);
    };

    const handlePreviewAndCreate = () => {
        navigate('/NoviOtpisPregled', {
            state: {
                dodaniArtikli,
                datumIzdatnice,
                dokumentId,
                UserId: userDetails.UserId,
            }
        });
    };

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <h3 className="text-center mb-4">Kreiraj Otpis #{dokumentId}</h3>

                    

                    <Form.Group className="mb-3">
                        <Form.Label>Primka</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedPrimkaId}
                            onChange={(e) => setSelectedPrimkaId(e.target.value)}
                        >
                            <option value="">-- Odaberi primku --</option>
                            {primke.map(primka => (
                                <option key={primka.dokumentId} value={primka.dokumentId}>
                                    {primka.oznakaDokumenta || `Primka #${primka.dokumentId}`} ({new Date(primka.datumDokumenta).toLocaleDateString('hr-HR')})
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Artikl</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedArtikl}
                            onChange={(e) => setSelectedArtikl(e.target.value)}
                            disabled={!selectedPrimkaId}
                        >
                            <option value="">-- Odaberi --</option>
                            {primkaArtikli.map(a => (
                                <option key={`${a.artiklId}-${a.dokumentId || selectedPrimkaId}`} value={a.artiklId}>
                                    {a.artiklNaziv} ({a.artiklJmj})
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Količina</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={kolicina}
                                    onChange={(e) => setKolicina(e.target.value)}
                                    min="0"
                                    max={raspolozivaKolicina}
                                    disabled={!selectedArtikl}
                                />
                                {selectedArtikl && (
                                    <Form.Text className="text-muted">
                                        Dostupno: {raspolozivaKolicina}
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </Col>


                    </Row>

                    <div className="d-flex justify-content-between mt-3">
                        <Button
                            onClick={handleAddArtikl}
                            disabled={!selectedPrimkaId || !selectedArtikl || !kolicina || raspolozivaKolicina <= 0}
                        >
                            Dodaj Artikl
                        </Button>
                        <Button variant="secondary" onClick={() => {
                            setSelectedArtikl('');
                            setKolicina('');
                        }}>Odustani</Button>
                    </div>

                    <div className="text-center mt-4">
                        <Button
                            variant="info"
                            onClick={handlePreviewAndCreate}
                            disabled={!dodaniArtikli.length}
                        >
                            Pregledaj artikle i napravi otpis
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <h3 className="mt-4">Dodani Artikli</h3>
            <Table striped bordered hover variant="light">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Oznaka</th>
                        <th>Naziv</th>
                        <th>Količina</th>
                        <th>Dokument</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {dodaniArtikli.map((a) => (
                        <tr key={a.redniBroj}>
                            <td>{a.redniBroj}</td>
                            <td>{a.artiklOznaka}</td>
                            <td>{a.artiklNaziv}</td>
                            <td>{a.kolicina}</td>
                            <td>{a.izDokumentaOznaka} ({a.izDokumentaId})</td>
                            <td>
                                <Button variant="danger" onClick={() => handleRemoveArtikl(a.redniBroj)}>Obriši</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default NoviOtpis;
