import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Table, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Primka() {
    const [artikli, setArtikli] = useState([]);
    const [datumPrimke, setDatumPrimke] = useState(new Date());
    const [dokumentId, setDokumentId] = useState('');

    const [narudzbenice, setNarudzbenice] = useState([]);
    const [selectedNarudzbenicaId, setSelectedNarudzbenicaId] = useState('');
    const [dobavljacId, setDobavljacId] = useState('');

    const [userDetails, setUserDetails] = useState({ username: '', roles: [], UserId: "" });

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
    const fetchIsporukaNarudzbenice = async () => {
        try {
            const [statusResponse, narudzbeniceResponse] = await Promise.all([
                axios.get("https://localhost:5001/api/home/dokument_status_parovi", {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                }),
                axios.get("https://localhost:5001/api/home/joined_narudzbenice", {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                })
            ]);

            const zatvoreniStatusi = statusResponse.data
                .filter(ds =>
                    ds.statusId === 3 &&
                    (ds.aktivan === true || ds.aktivan === 1 || ds.Aktivan === true || ds.Aktivan === 1)
                )
                .map(ds => ds.dokumentId);

            const filtriraneNarudzbenice = narudzbeniceResponse.data.filter(n =>
                zatvoreniStatusi.includes(n.dokumentId)
            );

            setNarudzbenice(filtriraneNarudzbenice);
        } catch (err) {
            console.error("Greška pri dohvaćanju narudžbenica:", err);
            alert("Greška prilikom učitavanja zatvorenih narudžbenica.");
        }
    };

    fetchIsporukaNarudzbenice();
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
        const fetchArtikliZaNarudzbenicu = async () => {
            if (!selectedNarudzbenicaId) {
                setArtikli([]);
                return;
            }

            try {
                const response = await axios.get("https://localhost:5001/api/home/joined_artikls_db", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const filtrirani = response.data.filter(
                    item => item.dokumentId === parseInt(selectedNarudzbenicaId)
                ).map(item => ({
                    artiklId: item.artiklId,
                    artiklOznaka: item.artiklOznaka,
                    artiklNaziv: item.artiklNaziv,
                    artiklJmj: item.artiklJmj,
                    cijena: item.cijena,
                    kolicina: item.kolicina,
                    trenutnaKolicina: item.trenutnaKolicina,
                    selected: false,
                    odabranaKolicina: Math.max(item.kolicina - item.trenutnaKolicina, 0)
                }));

                const uniqueArtikli = Array.from(new Map(
                    filtrirani.map(art => [art.artiklId, art])
                ).values());

                const dostupni = uniqueArtikli.filter(a => a.odabranaKolicina > 0);

                setArtikli(dostupni);
            } catch (error) {
                console.error("Greška pri dohvaćanju artikala:", error);
                alert("Greška pri dohvaćanju artikala za narudžbenicu.");
            }
        };

        fetchArtikliZaNarudzbenicu();
    }, [selectedNarudzbenicaId]);

    useEffect(() => {
        if (selectedNarudzbenicaId) {
            const narudzbenica = narudzbenice.find(n => n.dokumentId === parseInt(selectedNarudzbenicaId));
            if (narudzbenica) {
                setDobavljacId(narudzbenica.dobavljacId);
            }
        }
    }, [selectedNarudzbenicaId, narudzbenice]);

    const odabraniArtikli = artikli
        .filter(a => a.selected && a.odabranaKolicina > 0)
        .map((a, index) => ({
            redniBroj: index + 1,
            artiklId: a.artiklId,
            artiklOznaka: a.artiklOznaka,
            artiklNaziv: a.artiklNaziv,
            kolicina: a.odabranaKolicina,
            cijena: a.cijena,
            ukupnaCijena: a.odabranaKolicina * a.cijena
        }));

    const ukupniZbrojCijena = odabraniArtikli.reduce((acc, art) => acc + art.ukupnaCijena, 0);


    return (
        <Container className="mt-5">
            <Card className="form-card">
                <Card.Body>
                    <div className="text-center mb-3">
                        <h3>PRIMKA: {dokumentId}</h3>
                    </div>
                    <h2 className="text-center">Kreiraj Primku</h2>
                    <Form>
                        <Form.Group controlId="narudzbenicaSelect">
                            <Form.Label>Odaberi Narudžbenicu</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedNarudzbenicaId}
                                onChange={(e) => setSelectedNarudzbenicaId(e.target.value)}
                            >
                                <option value="">-- Odaberi narudžbenicu --</option>
                                {narudzbenice.map((nar) => (
                                    <option key={nar.dokumentId} value={nar.dokumentId}>
                                        {nar.oznakaDokumenta}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        {selectedNarudzbenicaId && (
                            <Table striped bordered hover className="mt-3" variant="light">
                                <thead>
                                    <tr>
                                        <th>Odaberi</th>
                                        <th>Oznaka</th>
                                        <th>Naziv Artikla</th>
                                        <th>Cijena</th>
                                        <th>Količina</th>
                                    </tr>
                                </thead>
                                <tbody>
                                   {artikli.map((art) => (
                                        <tr key={art.artiklId}>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={art.selected || false}
                                                    onChange={() => {
                                                        setArtikli(prev => prev.map(a => a.artiklId === art.artiklId ? { ...a, selected: !a.selected } : a));
                                                    }}
                                                />
                                            </td>
                                            <td>{art.artiklOznaka}</td>
                                            <td>{art.artiklNaziv}</td>
                                            <td>{art.cijena}</td>
                                            <td>
                                                {art.selected ? (
                                                    <Form.Control
                                                        type="number"
                                                        value={art.odabranaKolicina}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setArtikli(prev => prev.map(a => a.artiklId === art.artiklId ? { ...a, odabranaKolicina: val } : a));
                                                        }}
                                                    />
                                                ) : (
                                                    Math.max(art.kolicina - art.trenutnaKolicina, 0)
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Form>
                </Card.Body>
            </Card>

            <div className="mt-3">
                <Button
                    variant="info"
                    onClick={() => {
                        navigate('/primkanova', {
                            state: {
                                dodaniArtikli: odabraniArtikli,
                                datumPrimke,
                                dokumentId,
                                UserId: userDetails.UserId,
                                dobavljacId,
                                narudzbenicaId: parseInt(selectedNarudzbenicaId)

                            }
                        });
                    }}
                    disabled={odabraniArtikli.length === 0 || !dobavljacId}
                >
                    Pregledaj artikle i napravi primku
                </Button>
            </div>

            <div className="total-price-footer">
                <h4>Ukupan Zbroj Cijena: {ukupniZbrojCijena.toFixed(2)} €</h4>
            </div>
        </Container>
    );
}

export default Primka;
