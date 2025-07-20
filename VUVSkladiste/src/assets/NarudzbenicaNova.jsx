import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Table, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

function NarudzbenicaNova() {
    const [artikli, setArtikli] = useState([]);
    const [dobavljaci, setDobavljaci] = useState([]);
    const [naciniPlacanja, setNaciniPlacanja] = useState([]);

    const [selectedArtikl, setSelectedArtikl] = useState('');
    const [selectedDobavljacId, setSelectedDobavljacId] = useState('');
    const [kolicina, setKolicina] = useState('');
    const [napomena, setNapomena] = useState('');
    const [cijena, setCijena] = useState('');
    const [dodaniArtikli, setDodaniArtikli] = useState([]);
    const [ukupnaCijena, setUkupnaCijena] = useState(0);
    const [ukupniZbrojCijena, setUkupniZbrojCijena] = useState(0);

    const [mjestoIsporuke, setMjestoIsporuke] = useState('');
    const [rokIsporuke, setRokIsporuke] = useState('');
    const [npId, setNpId] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchArtikli = async () => {
            try {
                const response = await axios.get("https://localhost:5001/api/home/artikli_db", {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });
                setArtikli(response.data);
            } catch (error) {
                console.error(error);
                alert("Greška prilikom učitavanja artikala");
            }
        };

        const fetchDobavljaci = async () => {
            try {
                const response = await axios.get("https://localhost:5001/api/home/dobavljaciDTO", {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });
                setDobavljaci(response.data);
            } catch (error) {
                console.error(error);
                alert("Greška prilikom učitavanja dobavljača");
            }
        };

        const fetchNaciniPlacanja = async () => {
            try {
                const response = await axios.get("https://localhost:5001/api/home/nacini_placanja", {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });
                setNaciniPlacanja(response.data);
            } catch (error) {
                console.error(error);
                alert("Greška prilikom učitavanja načina plaćanja");
            }
        };

        fetchArtikli();
        fetchDobavljaci();
        fetchNaciniPlacanja();
    }, []);

    useEffect(() => {
        if (kolicina && cijena) {
            setUkupnaCijena(kolicina * cijena);
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
        if (!artikl || !kolicina || !cijena) return;

        const novi = {
            redniBroj: dodaniArtikli.length + 1,
            artiklId: artikl.artiklId,
            artiklOznaka: artikl.artiklOznaka,
            artiklNaziv: artikl.artiklNaziv,
            kolicina: parseFloat(kolicina),
            cijena: parseFloat(cijena),
            ukupnaCijena: parseFloat(kolicina) * parseFloat(cijena),
        };

        setDodaniArtikli([...dodaniArtikli, novi]);
        resetForm();
    };

    const resetForm = () => {
        setSelectedArtikl('');
        setKolicina('');
        setCijena('');
        setUkupnaCijena(0);
    };

    const handleRemoveArtikl = (redniBroj) => {
        const filtered = dodaniArtikli.filter(a => a.redniBroj !== redniBroj)
            .map((a, i) => ({ ...a, redniBroj: i + 1 }));
        setDodaniArtikli(filtered);
    };

    const handlePregled = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        if (rokIsporuke && rokIsporuke < todayStr) {
            alert('Rok isporuke mora biti danas ili kasnije.');
            return;
        }
        const dobavljacObj = dobavljaci.find(d => d.dobavljacId === parseInt(selectedDobavljacId));
        const nacinPlacanjaObj = naciniPlacanja.find(np => np.nP_Id === parseInt(npId));

        navigate('/pregled-narudzbenice', {
            state: {
                napomena,
                dobavljacId: parseInt(selectedDobavljacId),
                dobavljacNaziv: dobavljacObj?.dobavljacNaziv || '',
                npId: parseInt(npId),
                npNaziv: nacinPlacanjaObj?.nP_Naziv || '',
                artikli: dodaniArtikli,
                ukupno: ukupniZbrojCijena,
                mjestoIsporuke,
                rokIsporuke
            }
        });
    };

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Kreiraj Narudžbenicu</h2>
                    <Form>
                        <Form.Group controlId="dobavljacInput">
                            <Form.Label>Dobavljač</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedDobavljacId}
                                onChange={(e) => setSelectedDobavljacId(e.target.value)}
                            >
                                <option value="">Odaberi dobavljača...</option>
                                {dobavljaci.map(d => (
                                    <option key={d.dobavljacId} value={d.dobavljacId}>
                                        {d.dobavljacNaziv}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="napomenaInput">
                            <Form.Label>Napomena</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Unesite napomenu"
                                value={napomena}
                                onChange={(e) => setNapomena(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="mjestoIsporukeInput">
                            <Form.Label>Mjesto isporuke</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Unesite mjesto isporuke"
                                value={mjestoIsporuke}
                                onChange={(e) => setMjestoIsporuke(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="rokIsporukeInput">
                            <Form.Label>Rok isporuke</Form.Label>
                            <Form.Control
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={rokIsporuke}
                                onChange={(e) => setRokIsporuke(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="nacinPlacanjaInput">
                            <Form.Label>Način plaćanja</Form.Label>
                            <Form.Control
                                as="select"
                                value={npId}
                                onChange={(e) => setNpId(e.target.value)}
                            >
                                <option value="">Odaberi način plaćanja...</option>
                                {naciniPlacanja.map(np => (
                                    <option key={np.nP_Id} value={np.nP_Id}>
                                        {np.nP_Naziv}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Row className="mt-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>Artikl</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedArtikl}
                                        onChange={(e) => setSelectedArtikl(e.target.value)}
                                    >
                                        <option value="">Odaberi artikl...</option>
                                        {artikli.map((a) => (
                                            <option key={a.artiklId} value={a.artiklId}>
                                                {a.artiklNaziv} ({a.artiklJmj})
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Količina</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={kolicina}
                                        onChange={(e) => setKolicina(e.target.value)}
                                    />
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
                                    <Form.Label>Ukupno</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={ukupnaCijena.toFixed(2)}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-between mt-3">
                            <Button variant="primary" onClick={handleAddArtikl}>Dodaj Artikl</Button>
                            <Button variant="secondary" onClick={resetForm}>Resetiraj</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <h4 className="mt-4">Dodani Artikli</h4>
            <Table striped bordered hover className="mt-2">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Oznaka</th>
                        <th>Naziv</th>
                        <th>Količina</th>
                        <th>Cijena</th>
                        <th>Ukupno</th>
                        <th>Ukloni</th>
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
                            <td>{a.ukupnaCijena.toFixed(2)}</td>
                            <td>
                                <Button variant="danger" size="sm" onClick={() => handleRemoveArtikl(a.redniBroj)}>
                                    Obriši
                                </Button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="5" className="text-right"><strong>Ukupno:</strong></td>
                        <td colSpan="2"><strong>{ukupniZbrojCijena.toFixed(2)} €</strong></td>
                    </tr>
                </tbody>
            </Table>

            <div className="text-center mt-4">
                <Button
                    variant="info"
                    onClick={handlePregled}
                    disabled={
                        dodaniArtikli.length === 0 ||
                        !selectedDobavljacId ||
                        !mjestoIsporuke ||
                        !rokIsporuke ||
                        !npId
                    }
                >
                    Pregledaj Narudžbenicu
                </Button>
            </div>
        </Container>
    );
}

export default NarudzbenicaNova;
