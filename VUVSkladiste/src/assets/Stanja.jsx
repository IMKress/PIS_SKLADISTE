import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Card, Container } from 'react-bootstrap';
import axios from 'axios';
import { InfoArtiklModal, AddKategorijaModal } from './modals';
import { useNavigate } from 'react-router-dom';

function Stanja() {
    const [artikli, setArtikli] = useState([]);
    const [jmjOptions, setJmjOptions] = useState([]);
    const [kategorijeOptions, setKategorijeOptions] = useState([]);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showAddKategorijaModal, setShowAddKategorijaModal] = useState(false);
    const [selectedArtiklData, setSelectedArtiklData] = useState([]);
    const [selectedArtiklName, setSelectedArtiklName] = useState('');
    const [selectedArtiklKolicinaUlaz, setselectedArtiklKolicinaUlaz] = useState('');
    const [selectedArtiklKolicinaIzlaz, setselectedArtiklKolicinaIzlaz] = useState('');
    const [selectedArtiklIznosUlaz, setselectedArtiklIznosUlaz] = useState('');
    const [selectedArtiklIznosIzlaz, setselectedArtiklIznosIzlaz] = useState('');
    const [selectedArtiklJMJ, setselectedArtiklJMJ] = useState('');
    const [selectedArtiklKategorija, setselectedArtiklKategorija] = useState('');
    const [selectedArtiklId, setSelectedArtiklId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterJmj, setFilterJmj] = useState('');
    const [filterKategorija, setFilterKategorija] = useState('');
    const [userDetails, setUserDetails] = useState({ username: '', roles: [] });

    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const username = sessionStorage.getItem('Username');
        const roles = JSON.parse(sessionStorage.getItem('Role') || '[]');

        if (token) {
            setUserDetails({ username, roles });
        }
    }, []);

    const fetchData = async () => {
        try {
            const [artikliResponse, kategorijeResponse, joinedArtikliResponse] = await Promise.all([
                axios.get('https://localhost:5001/api/home/artikli_db', {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                }),
                axios.get('https://localhost:5001/api/home/kategorije', {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                }),
                axios.get('https://localhost:5001/api/home/joined_artikls_db', {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                }),
            ]);

            const artikliData = artikliResponse.data;
            const kategorijeData = kategorijeResponse.data;
            const joinedArtikliData = joinedArtikliResponse.data;

            setKategorijeOptions(kategorijeData);

            const artiklKolicine = joinedArtikliData.reduce((acc, curr) => {
                if (!acc[curr.artiklId]) {
                    acc[curr.artiklId] = { ulaz: 0, izlaz: 0, iznosUlaz: 0, iznosIzlaz: 0, cijena: curr.cijena };
                }
                if (curr.tipDokumenta === 'Primka') {
                    acc[curr.artiklId].ulaz += curr.kolicina;
                    acc[curr.artiklId].iznosUlaz += curr.ukupnaCijena;
                } else if (curr.tipDokumenta === 'Izdatnica') {
                    acc[curr.artiklId].izlaz += curr.kolicina;
                    acc[curr.artiklId].iznosIzlaz += curr.ukupnaCijena;
                }
                return acc;
            }, {});

            const enrichedArtikli = artikliData.map((art) => ({
                ...art,
                kolicinaUlaz: artiklKolicine[art.artiklId]?.ulaz || 0,
                kolicinaIzlaz: artiklKolicine[art.artiklId]?.izlaz || 0,
                iznosUlaz: artiklKolicine[art.artiklId]?.iznosUlaz || 0,
                iznosIzlaz: artiklKolicine[art.artiklId]?.iznosIzlaz || 0,
                cijena: artiklKolicine[art.artiklId]?.cijena || 0,
                stanje:
                    (artiklKolicine[art.artiklId]?.ulaz || 0) -
                    (artiklKolicine[art.artiklId]?.izlaz || 0),
                stanjeCijena:
                    ((artiklKolicine[art.artiklId]?.ulaz || 0) -
                        (artiklKolicine[art.artiklId]?.izlaz || 0)) *
                    (artiklKolicine[art.artiklId]?.cijena || 0),
            }));

            setArtikli(enrichedArtikli);

            const uniqueJmj = [...new Set(artikliData.map((art) => art.artiklJmj))];
            setJmjOptions(uniqueJmj);
        } catch (error) {
            console.error(error);
            alert('Greška prilikom učitavanja podataka');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!showInfoModal) {
            fetchData();
        }
    }, [showInfoModal]);

    const handleAddKategorija = async (kategorijaNaziv) => {
        try {
            await axios.post(
                'https://localhost:5001/api/home/add_kategorija',
                { kategorijaNaziv },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                }
            );
            alert(`Kategorija "${kategorijaNaziv}" je uspješno dodana.`);
            setShowAddKategorijaModal(false);
            fetchData();
        } catch (error) {
            console.error('Greška prilikom dodavanja kategorije:', error);
            alert('Greška prilikom dodavanja kategorije');
        }
    };

    const handleShowInfo = async (artiklId, kolicinaUlaz, kolicinaIzlaz, iznosUlaz, iznosIzlaz, artiklJmj, artiklKategorija) => {
        try {
            const response = await axios.get('https://localhost:5001/api/home/joined_artikls_db', {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });
            const filteredArtiklData = response.data.filter((item) => item.artiklId === artiklId);
            const selectedArtikl = artikli.find(art => art.artiklId === artiklId);

            setSelectedArtiklData(filteredArtiklData);
            setSelectedArtiklName(selectedArtikl ? selectedArtikl.artiklNaziv : '');
            setselectedArtiklKolicinaUlaz(kolicinaUlaz);
            setselectedArtiklKolicinaIzlaz(kolicinaIzlaz);
            setselectedArtiklIznosUlaz(iznosUlaz);
            setselectedArtiklIznosIzlaz(iznosIzlaz);
            setSelectedArtiklId(artiklId);
            setselectedArtiklJMJ(artiklJmj);
            setselectedArtiklKategorija(artiklKategorija);
            setShowInfoModal(true);
        } catch (error) {
            console.error(error);
            alert('Greška prilikom učitavanja podataka');
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDeleteArtikl = async (artiklId) => {
        try {
            await axios.delete(`https://localhost:5001/api/home/delete_artikl/${artiklId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            alert(`Artikl s ID-om ${artiklId} je obrisan.`);
            setShowInfoModal(false);
            fetchData();
        } catch (error) {
            console.error("Greška prilikom brisanja artikla:", error);
            alert("Greška prilikom brisanja artikla");
        }
    };

    const filteredArtikli = artikli
        .filter(art => (filterJmj ? art.artiklJmj === filterJmj : true))
        .filter(art => (filterKategorija ? art.kategorijaNaziv === filterKategorija : true))
        .filter(art =>
            art.artiklId.toString().includes(searchTerm) ||
            art.artiklNaziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
            art.artiklJmj.toLowerCase().includes(searchTerm.toLowerCase()) ||
            art.kategorijaNaziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (art.kolicinaUlaz !== undefined && art.kolicinaUlaz.toString().includes(searchTerm))
        );

    const stanjaFix = (stanje) => stanje || 0;

    return (
        <Container>
            {userDetails.roles.includes('Administrator') && (
                <>
                    <Button
                        variant="info"
                        onClick={() => navigate('/DodajNoviArtikl')}
                        className="small-button-Stanja me-2"
                        size="sm"
                    >
                        Dodaj Artikl
                    </Button>

                    <Button
                        variant="info"
                        onClick={() => navigate('/dodajkategoriju')}
                        className="small-button-Stanja"
                        size="sm"
                    >
                        Dodaj Kategoriju
                    </Button>
                    

                </>
            )}
            <Card className="form-card">

                <Card.Body>

                    <Card.Header className="text-light" as="h4">Artikli</Card.Header>

                    <Form.Group controlId="searchArtikl" className="mt-3" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>

                        <Form.Control
                            type="text"
                            placeholder="Pretraži po Šifri, Nazivu, Jmj, Kategoriji ili Količini..."
                            value={searchTerm}
                            onChange={handleSearch}
                            style={{ width: '80%' }}
                        />

                    </Form.Group>

                    <div className="d-flex justify-content-center gap-2 mt-2">
                        <Form.Select value={filterJmj} onChange={e => setFilterJmj(e.target.value)} style={{ width: '40%' }}>
                            <option value="">Sve JMJ</option>
                            {jmjOptions.map(j => (
                                <option key={j} value={j}>{j}</option>
                            ))}
                        </Form.Select>
                        <Form.Select value={filterKategorija} onChange={e => setFilterKategorija(e.target.value)} style={{ width: '40%' }}>
                            <option value="">Sve kategorije</option>
                            {kategorijeOptions.map(k => (
                                <option key={k.kategorijaNaziv} value={k.kategorijaNaziv}>{k.kategorijaNaziv}</option>
                            ))}
                        </Form.Select>
                    </div>

                    <Table striped bordered hover variant="light">
                        <thead>
                            <tr>
                                <th>Oznaka</th>
                                <th>Naziv artikla</th>
                                <th>Jedinična mjerna jedinica</th>
                                <th>Kategorija</th>
                                <th>Stanje</th>
                                <th>Stanje Cijena</th>
                                <th>Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredArtikli.map((art) => (
                                <tr key={art.artiklId}>
                                    <td>{art.artiklOznaka}</td>
                                    <td>{art.artiklNaziv}</td>
                                    <td>{art.artiklJmj}</td>
                                    <td>{art.kategorijaNaziv}</td>
                                    <td>{art.stanje}</td>
                                    <td>{stanjaFix(art.stanjeCijena).toFixed(2)} </td>
                                    <td>
                                        <Button
                                            variant="info"
                                            size="sm"
                                            onClick={() => navigate(`/artikl/${art.artiklId}`)}
                                        >
                                            Prikaz
                                        </Button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <InfoArtiklModal
                show={showInfoModal}
                handleClose={() => setShowInfoModal(false)}
                artiklData={selectedArtiklData}
                artiklName={selectedArtiklName}
                kolicinaUlaz={selectedArtiklKolicinaUlaz}
                kolicinaIzlaz={selectedArtiklKolicinaIzlaz}
                iznosUlaz={selectedArtiklIznosUlaz}
                iznosIzlaz={selectedArtiklIznosIzlaz}
                artiklId={selectedArtiklId}
                handleDeleteArtikl={handleDeleteArtikl}
                jmjOptions={jmjOptions}
                kategorijeOptions={kategorijeOptions}
                artJmj={selectedArtiklJMJ}
                artKat={selectedArtiklKategorija}
            />

            <AddKategorijaModal
                show={showAddKategorijaModal}
                handleClose={() => setShowAddKategorijaModal(false)}
                handleSave={handleAddKategorija}
            />
        </Container>
    );
}

export default Stanja;
