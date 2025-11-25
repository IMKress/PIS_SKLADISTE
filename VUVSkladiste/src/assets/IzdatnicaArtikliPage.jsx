import React, { useState } from 'react';
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

    const initialDate = datumIzdatnice ? new Date(datumIzdatnice) : new Date();
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [napomena, setNapomena] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const oznaka = generirajOznakuDokumenta();

    if (!dodaniArtikli) {
        return <div className="container mt-4">Greška: Nema podataka za izdatnicu.</div>;
    }

    const ukupniZbrojCijena = dodaniArtikli.reduce((acc, artikl) => acc + artikl.ukupnaCijena, 0);

    const formatDateForAPI = (date) => format(date, 'MM.dd.yyyy');

    const handleButtonClick = async () => {
        setIsProcessing(true);
        try {
            const lokacijePodaci = await fetchLokacijeForArtikli();

            const newDokumentId = await handleCreateIzdatnica();
            await FIFOalg();

            navigate('/IzdatnicaLokacijePregled', {
                state: {
                    
                    lokacijePodaci,
                    dokumentId: newDokumentId,
                    oznaka,
                    mjestoTroska,
                    napomena,
                    datumIzdatnice: format(selectedDate, 'dd.MM.yyyy'),
                    ukupniZbrojCijena: ukupniZbrojCijena.toFixed(2)
                }
            });
        } catch (error) {
            console.error('Greška prilikom kreiranja izdatnice:', error);
            alert('Došlo je do greške prilikom kreiranja izdatnice.');
        } finally {
            setIsProcessing(false);
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
        try {

            const createDokumentResponse = await axios.post(API_URLS.pAddDok(), dokumentBody, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (createDokumentResponse.status === 200) {
                const newDokumentId = createDokumentResponse.data.dokumentId || dokumentId;

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
                        throw new Error('Greška prilikom dodavanja artikla.');
                    }
                }
                return newDokumentId;
            }

            throw new Error('Greška prilikom stvaranja izdatnice.');
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const fetchLokacijeForArtikli = async () => {
        const rezultati = [];
        const token = localStorage.getItem('token');

        const requestConfig = token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {};

        for (const artikl of dodaniArtikli) {
            try {
                const response = await axios.get(
                    API_URLS.gLokacijeArtiklaIzdatnice(artikl.artiklId, artikl.kolicina),
                    requestConfig
                );

                const artiklLokacije = Array.isArray(response.data) ? response.data : [];
                rezultati.push(
                    ...artiklLokacije.map((lokacija) => ({
                        ...lokacija,
                        trazenaKolicina: artikl.kolicina,
                        artiklOznaka: artikl.artiklOznaka
                    }))
                );
            } catch (error) {
                console.error('Greška pri dohvaćanju lokacija artikla:', error);
            }
        }

        return rezultati;
    };

    const updateTrenutnaKolicina = async (artiklId, dokumentId, newKolicina) => {
        try {
            await axios.post(API_URLS.pUpdateKolArtikl(), {
                ArtiklId: artiklId,
                DokumentId: dokumentId,
                NewKolicina: newKolicina
            });
        } catch (error) {
            console.error('Greška pri ažuriranju količine:', error);
        }
    };

    const FIFOalg = async () => {
        for (const art of dodaniArtikli) {
            try {
                const response = await axios.get(API_URLS.gFifoList(art.artiklId));
                const dataList = response.data;
                let remainingQuantity = art.kolicina;

                for (let i = 0; i < dataList.length && remainingQuantity > 0; i++) {
                    let stockEntry = dataList[i];

                    if (stockEntry.trenutnaKolicina >= remainingQuantity) {
                        stockEntry.trenutnaKolicina -= remainingQuantity;
                        remainingQuantity = 0;
                    } else {
                        remainingQuantity -= stockEntry.trenutnaKolicina;
                        stockEntry.trenutnaKolicina = 0;
                    }
                }

                for (const stockEntry of dataList) {
                    await updateTrenutnaKolicina(stockEntry.artiklId, stockEntry.dokumentId, stockEntry.trenutnaKolicina);
                }

                if (remainingQuantity > 0) {
                    alert(`Nedovoljna količina za artikl ${art.artiklNaziv}. Preostalo: ${remainingQuantity}`);
                }
            } catch (error) {
                console.error('Greška u FIFO algoritmu:', error);
            }
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
                        <Button variant="success" onClick={handleButtonClick} disabled={isProcessing}>
                            {isProcessing ? 'Obrada...' : 'Napravi izdatnicu'}
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default IzdatnicaArtikliPage;
