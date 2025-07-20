import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Table, Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { generirajOznakuDokumenta } from './oznakaDokumenta';

function PregledNarudzbenice() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        napomena,
        artikli,
        ukupno,
        dobavljacId,
        dobavljacNaziv,
        mjestoIsporuke,
        rokIsporuke,
        npId,
        npNaziv
    } = location.state || {};

    const [loading, setLoading] = useState(false);
    const userId = sessionStorage.getItem('UserId');
    const oznaka = generirajOznakuDokumenta();

    const handleCreateNarudzbenica = async () => {
        if (!userId) {
            alert("Korisnik nije prijavljen.");
            return;
        }

        setLoading(true);

        const dokumentBody = {
            DokumentId: 0,
            DatumDokumenta: new Date().toISOString(),
            TipDokumentaId: 3,
            ZaposlenikId: userId,
            Napomena: napomena || '',
            DobavljacId: dobavljacId,
            OznakaDokumenta: oznaka
        };

        try {
            const createDokumentResponse = await axios.post(
                'https://localhost:5001/api/home/add_narudzbenica',
                dokumentBody,
                { headers: { 'Content-Type': 'application/json' } }
            );

            const dokumentId = createDokumentResponse.data?.dokumentId || createDokumentResponse.data;

            if (!dokumentId || isNaN(dokumentId)) {
                alert("Greška: nije vraćen ID dokumenta.");
                setLoading(false);
                return;
            }

            for (const artikl of artikli) {
                const artiklDokBody = {
                    Id: 0,
                    DokumentId: dokumentId,
                    ArtiklId: artikl.artiklId,
                    RbArtikla: artikl.redniBroj,
                    Kolicina: artikl.kolicina,
                    Cijena: artikl.cijena,
                    UkupnaCijena: artikl.ukupnaCijena,
                    TrenutnaKolicina: 0,
                    ZaposlenikId: userId
                };

                const res = await axios.post(
                    'https://localhost:5001/api/home/add_artDok',
                    artiklDokBody,
                    { headers: { 'Content-Type': 'application/json' } }
                );

                if (res.status !== 200) {
                    alert(`Greška kod artikla: ${artikl.artiklNaziv}`);
                    setLoading(false);
                    return;
                }
            }

            // Dodaj NarudzbenicaDetalji
            const detaljiBody = {
                dokumentId,
                mjestoIsporuke,
                rokIsporuke,
                np_Id: npId
            };

            await axios.post(
                'https://localhost:5001/api/home/narudzbenica_detalji',
                detaljiBody,
                { headers: { 'Content-Type': 'application/json' } }
            );

            alert("Narudžbenica uspješno spremljena!");
            navigate('/Narudzbenice');
        } catch (error) {
            console.error(error);
            alert("Greška prilikom spremanja narudžbenice.");
        } finally {
            setLoading(false);
        }
    };

    if (!artikli || artikli.length === 0) {
        return (
            <Container className="mt-5">
                <Card body>
                    <h4>Podaci o narudžbenici nisu dostupni.</h4>
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Nazad
                    </Button>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <h2 className="text-center">Pregled Narudžbenice</h2>
                    <hr />
                    <p><strong>Dobavljač:</strong> {dobavljacNaziv} </p>
                    <p><strong>Način plaćanja:</strong> {npNaziv} </p>
                    <p><strong>Mjesto isporuke:</strong> {mjestoIsporuke}</p>
                    <p><strong>Rok isporuke:</strong> {rokIsporuke}</p>
                    <p><strong>Napomena:</strong> {napomena || 'Nema napomene'}</p>

                    <h5 className="mt-4">Artikli</h5>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Oznaka</th>
                                <th>Naziv Artikla</th>
                                <th>Količina</th>
                                <th>Cijena</th>
                                <th>Ukupna Cijena</th>
                            </tr>
                        </thead>
                        <tbody>
                            {artikli.map((a, index) => (
                                <tr key={index}>
                                    <td>{a.redniBroj}</td>
                                    <td>{a.artiklOznaka}</td>
                                    <td>{a.artiklNaziv}</td>
                                    <td>{a.kolicina}</td>
                                    <td>{parseFloat(a.cijena).toFixed(2)} €</td>
                                    <td>{parseFloat(a.ukupnaCijena).toFixed(2)} €</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="5" className="text-end"><strong>Ukupno:</strong></td>
                                <td><strong>{parseFloat(ukupno).toFixed(2)} €</strong></td>
                            </tr>
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                            Povratak
                        </Button>
                        <Button
                            variant="info"
                            onClick={handleCreateNarudzbenica}
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" animation="border" /> : 'Kreiraj Narudžbenicu'}
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default PregledNarudzbenice;
