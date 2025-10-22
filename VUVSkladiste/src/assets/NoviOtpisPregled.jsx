import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Form, Button, Container, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { generirajOznakuDokumenta } from './oznakaDokumenta';
import { API_URLS } from '../API_URL/getApiUrl';

function NoviOtpisPregled() {
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
        return <div className="container mt-4">Greška: Nema podataka za otpis.</div>;
    }


    const formatDateForAPI = (date) => format(date, 'MM.dd.yyyy');

    const artikliPrimkeCache = useRef({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getAuthHeaders = () => ({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const fetchArtikliForDokument = async (dokumentId) => {
        if (!artikliPrimkeCache.current[dokumentId]) {
            const response = await axios.get(API_URLS.gArtikliByDokument(dokumentId), {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            artikliPrimkeCache.current[dokumentId] = response.data;
        }
        return artikliPrimkeCache.current[dokumentId];
    };

    const updateTrenutnaKolicina = async (artiklId, dokumentId, newKolicina) => {
        const response = await axios.post(API_URLS.pUpdateKolArtikl(), {
            ArtiklId: artiklId,
            DokumentId: dokumentId,
            NewKolicina: newKolicina
        }, getAuthHeaders());
        if (response.status !== 200) {
            throw new Error('Neuspjelo ažuriranje količine.');
        }
    };

    const handleButtonClick = async () => {
        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);
        try {
            await handleCreateOtpis();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateOtpis = async () => {
        const formattedDate = formatDateForAPI(selectedDate);

        const dokumentBody = {
            DokumentId: 0,
            DatumDokumenta: formattedDate,
            TipDokumentaId: 4,
            ZaposlenikId: UserId,
            Napomena: napomena,
            DobavljacId: null,
            OznakaDokumenta: oznaka,
            MjestoTroska: null
        };
        try {

            const createDokumentResponse = await axios.post(API_URLS.pAddDok(), dokumentBody, getAuthHeaders());
            if (createDokumentResponse.status === 200) {
                const newDokumentId = createDokumentResponse.data.dokumentId || dokumentId;
                const potrosnjaPoDokumentu = new Map();

                for (const artikl of dodaniArtikli) {
                    const artiklDokBody = {
                        id: 0,
                        DokumentId: newDokumentId,
                        RbArtikla: artikl.redniBroj,
                        Kolicina: artikl.kolicina,
                        Cijena: 0,
                        UkupnaCijena: 0,
                        ArtiklId: artikl.artiklId,
                        TrenutnaKolicina: 0,
                        ZaposlenikId: UserId
                    };

                    const response = await axios.post(API_URLS.pAddArtDok(), artiklDokBody, getAuthHeaders());

                    if (response.status !== 200) {
                        alert('Greška prilikom dodavanja artikla.');
                        return;
                    }

                    const kljuc = `${artikl.izDokumentaId}-${artikl.artiklId}`;
                    const trenutnaKolicina = potrosnjaPoDokumentu.get(kljuc) || 0;
                    potrosnjaPoDokumentu.set(kljuc, trenutnaKolicina + artikl.kolicina);
                }

                for (const [kljuc, utrosenaKolicina] of potrosnjaPoDokumentu.entries()) {
                    const [dokumentIdPrimke, artiklId] = kljuc.split('-').map(Number);
                    try {
                        const artikliPrimke = await fetchArtikliForDokument(dokumentIdPrimke);
                        const artiklPrimke = artikliPrimke.find(a => parseInt(a.artiklId, 10) === artiklId);
                        if (!artiklPrimke) {
                            alert('Odabrani artikl nije pronađen na primci.');
                            return;
                        }
                        const trenutnaKolicinaNaPrimci = parseFloat(artiklPrimke.trenutnaKolicina ?? artiklPrimke.kolicina ?? 0);
                        const novaKolicina = Math.max(trenutnaKolicinaNaPrimci - Number(utrosenaKolicina), 0);
                        await updateTrenutnaKolicina(artiklId, dokumentIdPrimke, novaKolicina);
                    } catch (error) {
                        console.error('Greška prilikom ažuriranja količine na primci:', error);
                        alert('Greška prilikom ažuriranja količina na primci.');
                        return;
                    }
                }

                alert('Otpis uspješno kreiran!');
                navigate('/Dokumenti');
            } else {
                alert('Greška prilikom stvaranja otpisa.');
            }
        } catch (error) {
            console.error(error);
            alert('Došlo je do greške!');
        }
    };

    return (
        <Container className="mt-4">
            <Card className="form-card">
                <Card.Header className="text-light" as="h4">Pregled Otpisa</Card.Header>

                <Card.Body>


                    <Form.Group controlId="formDatumIzdatnice" className="my-3">
                        <Form.Label>Datum otpisa</Form.Label>
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
                                <th>Dokument</th>

                            </tr>
                        </thead>
                        <tbody>
                            {dodaniArtikli.map((artikl) => (
                                <tr key={artikl.redniBroj}>
                                    <td>{artikl.redniBroj}</td>
                                    <td>{artikl.artiklOznaka}</td>
                                    <td>{artikl.artiklNaziv}</td>
                                    <td>{artikl.kolicina}</td>
                                    <td>{artikl.izDokumentaOznaka ? `${artikl.izDokumentaOznaka} (${artikl.izDokumentaId})` : artikl.izDokumentaId}</td>

                                </tr>
                            ))}

                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="success" onClick={handleButtonClick} disabled={isSubmitting}>
                            {isSubmitting ? 'Spremanje...' : 'Napravi Otpis'}
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default NoviOtpisPregled;
