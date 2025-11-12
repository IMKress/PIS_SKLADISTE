import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Form, Button, Container, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { generirajOznakuDokumenta } from './oznakaDokumenta';
import { API_URLS } from '../API_URL/getApiUrl';

function IzdatnicaArtikliPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        dodaniArtikli,
        datumIzdatnice,
        dokumentId,
        UserId,
        mjestoTroska
    } = location.state || {};

    const [selectedDate, setSelectedDate] = useState(datumIzdatnice || new Date());
    const [napomena, setNapomena] = useState('');
    const oznaka = generirajOznakuDokumenta();

    if (!dodaniArtikli) {
        return <div className="container mt-4">Greška: Nema podataka za izdatnicu.</div>;
    }

    const ukupniZbrojCijena = dodaniArtikli.reduce((acc, artikl) => acc + artikl.ukupnaCijena, 0);

    const formatDateForAPI = (date) => format(date, 'MM.dd.yyyy');

    const handleButtonClick = async () => {
        const newDokumentId = await handleCreateIzdatnica();
        if (!newDokumentId) {
            return;
        }

        try {
            const response = await axios.post(
                API_URLS.pExecuteFifoIzdatnica(),
                { dokumentId: newDokumentId },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const lokacije = Array.isArray(response.data) ? response.data : [];

            navigate('/IzdatnicaLokacijePregled', {
                state: {
                    lokacije,
                    dokumentId: newDokumentId,
                    oznaka,
                    mjestoTroska,
                },
            });
        } catch (error) {
            console.error('Greška pri izvršavanju FIFO procedure:', error);
            alert('FIFO procedura nije uspješno izvršena. Provjerite spremljenu proceduru.');
        }
    };

    const handleCreateIzdatnica = async () => {
        const formattedDate = formatDateForAPI(selectedDate);

        const dokumentBody = {
            DokumentId: 0,
            DatumDokumenta: formattedDate,
            TipDokumentaId: 2,
            ZaposlenikId: UserId,
            Napomena: napomena,
            DobavljacId: null,
            OznakaDokumenta: oznaka,
            MjestoTroska: mjestoTroska
        };
        console.log('Dokument koji se šalje:', dokumentBody);
        try {
            const createDokumentResponse = await axios.post(API_URLS.pAddDok(), dokumentBody, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (createDokumentResponse.status === 200) {
                const newDokumentId = createDokumentResponse.data.dokumentId || createDokumentResponse.data.DokumentId || dokumentId;

                for (const artikl of dodaniArtikli) {
                    const artiklDokBody = {
                        id: 0,
                        DokumentId: newDokumentId,
                        RbArtikla: artikl.redniBroj,
                        Kolicina: artikl.kolicina,
                        Cijena: artikl.cijena,
                        UkupnaCijena: artikl.ukupnaCijena,
                        ArtiklId: artikl.artiklId,
                        TrenutnaKolicina: 0,
                        ZaposlenikId: UserId
                    };

                    const response = await axios.post(API_URLS.pAddArtDok(), artiklDokBody, {
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (response.status !== 200) {
                        alert('Greška prilikom dodavanja artikla.');
                        return null;
                    }
                }
                return newDokumentId;
            } else {
                alert('Greška prilikom stvaranja izdatnice.');
                return null;
            }
        } catch (error) {
            console.error(error);
            alert('Došlo je do greške!');
            return null;
        }
    };

    return (
        <Container className="mt-4">
            <Card className="form-card">
                <Card.Header className="text-light" as="h4">Pregled Izdatnice</Card.Header>

                <Card.Body>

                    <div className="mb-3">
                        <strong>Mjesto troška:</strong> {mjestoTroska}
                    </div>

                    <Form.Group controlId="formDatumIzdatnice" className="my-3">
                        <Form.Label>Datum izdatnice</Form.Label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd.MM.yyyy"
                            className="form-control"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Napomena</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={napomena}
                            onChange={(e) => setNapomena(e.target.value)}
                            placeholder="Unesite napomenu"
                        />
                    </Form.Group>

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
                            {dodaniArtikli.map((artikl) => (
                                <tr key={artikl.redniBroj}>
                                    <td>{artikl.redniBroj}</td>
                                    <td>{artikl.artiklOznaka}</td>
                                    <td>{artikl.artiklNaziv}</td>
                                    <td>{artikl.kolicina}</td>
                                    <td>{artikl.cijena}</td>
                                    <td>{artikl.ukupnaCijena.toFixed(2)} €</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="5" className="text-end"><strong>Ukupno:</strong></td>
                                <td><strong>{ukupniZbrojCijena.toFixed(2)} €</strong></td>
                            </tr>
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="success" onClick={handleButtonClick}>
                            Napravi izdatnicu
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default IzdatnicaArtikliPage;
