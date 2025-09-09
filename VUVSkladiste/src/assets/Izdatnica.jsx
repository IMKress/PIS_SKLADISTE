import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Table, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Izdatnice() {
    const [artikli, setArtikli] = useState([]);
    const [selectedArtikl, setSelectedArtikl] = useState('');
    const [kolicina, setKolicina] = useState('');
    const [cijena, setCijena] = useState('');
    const [datumIzdatnice, setDatumIzdatnice] = useState(new Date());
    const [dodaniArtikli, setDodaniArtikli] = useState([]);
    const [ukupnaCijena, setUkupnaCijena] = useState(0);
    const [ukupniZbrojCijena, setUkupniZbrojCijena] = useState(0);
    const [dokumentId, setDokumentId] = useState('');
    const [raspolozivaKolicina, setRaspolozivaKolicina] = useState(0);
    const [prosjekCijena, setProsjekCijena] = useState(0);

    const [mjestoTroska, setMjestoTroska] = useState('');

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
        if (selectedArtikl) {
            axios
                .get(`https://localhost:5001/api/home/FIFO_list/${selectedArtikl}`)
                .then((res) => {
                    const ukupno = res.data.reduce(
                        (acc, item) => acc + item.trenutnaKolicina,
                        0
                    );
                    const sumaCijena = res.data.reduce(
                        (acc, item) => acc + item.cijena * item.trenutnaKolicina,
                        0
                    );
                    setRaspolozivaKolicina(ukupno);
                    const prosjek = ukupno ? sumaCijena / ukupno : 0;
                    setProsjekCijena(prosjek);
                    setCijena(prosjek.toFixed(2));
                })
                .catch(() => {
                    setRaspolozivaKolicina(0);
                    setProsjekCijena(0);
                    setCijena('');
                });
        } else {
            setRaspolozivaKolicina(0);
            setProsjekCijena(0);
            setCijena('');
        }
    }, [selectedArtikl]);


    useEffect(() => {
        const fetchArtikli = async () => {
            try {
                const response = await axios.get("https://localhost:5001/api/home/artikli_db", {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setArtikli(response.data);
            } catch (error) {
                console.error(error);
                alert("Greška prilikom učitavanja artikala");
            }
        };

        fetchArtikli();
    }, []);

    const getLastDokId = async () => {
        const response = await axios.get('https://localhost:5001/api/home/joined_dokument_tip');
        const existingIds = response.data.map(item => item.dokumentId);
        return existingIds.length > 0 ? existingIds.slice(-1)[0] : 0;
    };

    useEffect(() => {
        const fetchLastId = async () => {
            const lastId = await getLastDokId();
            setDokumentId(lastId + 1);
        };

        fetchLastId();
    }, []);

    useEffect(() => {
        if (kolicina && cijena) {
            setUkupnaCijena(parseFloat(kolicina) * parseFloat(cijena));
        } else {
            setUkupnaCijena(0);
        }
    }, [kolicina, cijena]);

    useEffect(() => {
        const zbroj = dodaniArtikli.reduce((acc, a) => acc + a.ukupnaCijena, 0);
        setUkupniZbrojCijena(zbroj);
    }, [dodaniArtikli]);

    const handleAddArtikl = () => {
        const artikl = artikli.find(a => a.artiklId === parseInt(selectedArtikl));
        if (!artikl || !kolicina || !cijena) {
            alert("Popunite sva polja.");
            return;
        }
        const kolicinaNum = parseFloat(kolicina);
        if (kolicinaNum <= 0) {
            alert("Količina mora biti veća od 0.");
            return;
        }
        if (kolicinaNum > raspolozivaKolicina) {
            alert(`Nedovoljna količina na skladištu. Dostupno: ${raspolozivaKolicina}`);
            return;
        }

       const novi = {
            redniBroj: dodaniArtikli.length + 1,
            artiklId: artikl.artiklId,
            artiklOznaka: artikl.artiklOznaka,
            artiklNaziv: artikl.artiklNaziv,
            kolicina: kolicinaNum,
            cijena: parseFloat(cijena),
            ukupnaCijena: kolicinaNum * parseFloat(cijena)
        };

        setDodaniArtikli(prev => [...prev, novi]);
        setRaspolozivaKolicina(prev => prev - kolicinaNum);
        setSelectedArtikl('');
        setKolicina('');
        setCijena('');
    };

    const handleRemoveArtikl = (rb) => {
        const novi = dodaniArtikli.filter(a => a.redniBroj !== rb)
            .map((a, i) => ({ ...a, redniBroj: i + 1 }));
        setDodaniArtikli(novi);
    };

    const handlePreviewAndCreate = () => {
        navigate('/IzdatnicaArtikliPage', {
            state: {
                dodaniArtikli,
                datumIzdatnice,
                dokumentId,
                UserId: userDetails.UserId,
                mjestoTroska: mjestoTroska.trim()
            }
        });
    };

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <h3 className="text-center mb-4">Kreiraj Izdatnicu #{dokumentId}</h3>

                    <Form.Group className="mb-3">
                        <Form.Label>Mjesto troška</Form.Label>
                        <Form.Control
                            type="text"
                            value={mjestoTroska}
                            onChange={(e) => setMjestoTroska(e.target.value)}
                            placeholder="Upišite mjesto troška"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Artikl</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedArtikl}
                            onChange={(e) => setSelectedArtikl(e.target.value)}
                        >
                            <option value="">-- Odaberi --</option>
                            {artikli.map(a => (
                                <option key={a.artiklId} value={a.artiklId}>
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
                                />
                                <Form.Text muted>
                                    Raspoloživo: {raspolozivaKolicina}
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Cijena</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={cijena}
                                    onChange={(e) => setCijena(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Ukupna Cijena</Form.Label>
                                <Form.Control type="text" value={ukupnaCijena.toFixed(2)} readOnly />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-between mt-3">
                        <Button onClick={handleAddArtikl}>Dodaj Artikl</Button>
                        <Button variant="secondary" onClick={() => {
                            setSelectedArtikl('');
                            setKolicina('');
                            setCijena('');
                        }}>Odustani</Button>
                    </div>

                    <div className="text-center mt-4">
                        <Button
                            variant="info"
                            onClick={handlePreviewAndCreate}
                            disabled={!dodaniArtikli.length || !mjestoTroska.trim()}
                        >
                            Pregledaj artikle i napravi izdatnicu
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
                        <th>Cijena</th>
                        <th>Ukupno</th>
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
                            <td>{a.cijena}</td>
                            <td>{a.ukupnaCijena.toFixed(2)} €</td>
                            <td>
                                <Button variant="danger" onClick={() => handleRemoveArtikl(a.redniBroj)}>Obriši</Button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="5" className="text-end"><strong>Ukupno:</strong></td>
                        <td><strong>{ukupniZbrojCijena.toFixed(2)} €</strong></td>
                        <td></td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    );
}

export default Izdatnice;
