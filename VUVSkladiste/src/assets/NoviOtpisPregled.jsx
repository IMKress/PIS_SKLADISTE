import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Form, Button, Container, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { generirajOznakuDokumenta } from './oznakaDokumenta';
import { isAdminUser } from '../utils/auth';

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

    useEffect(() => {
        if (!isAdminUser()) {
            navigate('/Otpisi');
        }
    }, [navigate]);

    if (!dodaniArtikli) {
        return <div className="container mt-4">Greška: Nema podataka za izdatnicu.</div>;
    }
    else{
        console.log(dodaniArtikli)
    }


    const formatDateForAPI = (date) => format(date, 'MM.dd.yyyy');

    const handleButtonClick = async () => {  //todo ree ne valja ovo
        await handleCreateIzdatnica();
    };

    const handleCreateIzdatnica = async () => {
        if (!isAdminUser()) {
            return;
        }
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
        console.log('Dokument koji se šalje:', dokumentBody);
        try {

            const createDokumentResponse = await axios.post('https://localhost:5001/api/home/add_dokument', dokumentBody, {
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
                        Cijena: 0,
                        UkupnaCijena: 0,
                        ArtiklId: artikl.artiklId,
                        TrenutnaKolicina: artikl.kolicina,
                        ZaposlenikId: UserId
                    };

                    const response = await axios.post('https://localhost:5001/api/home/add_artDok', artiklDokBody, {
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (response.status !== 200) {
                        alert('Greška prilikom dodavanja artikla.');
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
                             
                            </tr>
                        </thead>
                        <tbody>
                            {dodaniArtikli.map((artikl) => (
                                <tr key={artikl.redniBroj}>
                                    <td>{artikl.redniBroj}</td>
                                    <td>{artikl.artiklOznaka}</td>
                                    <td>{artikl.artiklNaziv}</td>
                                    <td>{artikl.kolicina}</td>
                                  
                                </tr>
                            ))}
                           
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="success" onClick={handleButtonClick}>
                            Napravi Otpis
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default NoviOtpisPregled;
