import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTable, useSortBy } from 'react-table'
import { Button, Card, Modal, Table } from "react-bootstrap";
import { API_URLS } from "../API_URL/getApiUrl";
import { isAdminUser } from "../utils/auth";
function DobavljaciDokumenti() {
    const { dobavljacId } = useParams();
    const [dokumenti, setDokumenti] = useState([]);
    const [dobavljac, setDobavljac] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const isAdmin = isAdminUser();

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchDokumenti = axios.get(
            API_URLS.gDokumentiByDobavljacStatus(dobavljacId),
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const fetchDobavljac = axios.get(
            API_URLS.gSingleDobavljaciDTO(dobavljacId),
            { headers: { Authorization: `Bearer ${token}` } }
        );

        Promise.all([fetchDokumenti, fetchDobavljac])
            .then(([dokRes, dobRes]) => {
                setDokumenti(dokRes.data);
                setDobavljac(dobRes.data);
                setLoading(false);
                console.log(dokRes.data)
            })
            .catch(err => {
                console.error("Greška prilikom dohvaćanja podataka:", err);
                alert("Greška prilikom dohvaćanja podataka.");
                setLoading(false);
            });
    }, [dobavljacId]);

    const handleDelete = () => {
        if (!isAdmin) {
            return;
        }
        axios.delete(
            API_URLS.dDeleteDobavljac(dobavljacId), {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(() => {
                alert("Dobavljač je uspješno obrisan.");
                navigate("/dobavljaci");
            })
            .catch(err => {
                console.error("Greška prilikom brisanja dobavljača:", err);
                alert("Greška prilikom brisanja dobavljača.");
            });
    };
    const handleShowInfoPage = (dokumentId) => {
        navigate(`/narudzbenica/${dokumentId}`);
    };
    // Definiraj kolone za react-table
    const columns = React.useMemo(
        () => [
            { Header: "Oznaka", accessor: "oznakaDokumenta" },
            {
                Header: "Datum",
                accessor: "datumDokumenta",
                Cell: ({ value }) => new Date(value).toLocaleDateString("hr-HR"),
            },
            { Header: "Tip", accessor: "tipDokumenta" },
            {
                Header: "Napomena",
                accessor: "napomena",
                Cell: ({ value }) => value || "—",
            },
            { Header: "Status", accessor: "statusDokumenta" },
            {
                Header: "Info", // zadnja kolona
                id: "actions",   // mora imati unikatan id
                Cell: ({ row }) => (
                    <button
                        onClick={() => handleShowInfoPage(row.original.dokumentId)}
                        className="btn btn-info btn-sm"
                    >
                        Info
                    </button>
                ),
            },
        ],
        []
    );
    const tableInstance = useTable(
        { columns, data: dokumenti },
        useSortBy
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    if (loading) return <p>Učitavanje...</p>;

    return (
        <div>
            <h3 className="mt-4">Dobavljač: {dobavljac?.dobavljacNaziv || `#${dobavljacId}`}</h3>

            {isAdmin && (
                <Button variant="danger" className="mb-3" onClick={() => setShowModal(true)}>
                    Obriši dobavljača
                </Button>
            )}
            {isAdmin && (
                <Button
                    variant="warning"
                    className="mb-3 ms-2"

                    onClick={() => navigate(`/dobavljaci/azuriraj/${dobavljacId}`)}
                >
                    Ažuriraj
                </Button>
            )}
            <Card className="form-card">
                <Card.Header className="text-light" as="h4">Popis Narudžbenica</Card.Header>
                <Card.Body>
                    {dokumenti.length === 0 ? (
                        <p className="mt-3">Nema dokumenata za ovog dobavljača.</p>
                    ) : (
                        <Table {...getTableProps()} striped bordered hover variant="light" className="centered-table mt-3">
                            <thead>
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                {column.render("Header")}
                                                <span>
                                                    {column.isSorted
                                                        ? column.isSortedDesc
                                                            ? " 🔽"
                                                            : " 🔼"
                                                        : ""}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {rows.map(row => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => (
                                                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}

                    {isAdmin && (
                        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Potvrda brisanja</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Jeste li sigurni da želite obrisati dobavljača "{dobavljac?.dobavljacNaziv}"?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Odustani
                                </Button>
                                <Button variant="danger" onClick={handleDelete}>
                                    Obriši
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </Card.Body>

            </Card >
        </div>
    );
}

export default DobavljaciDokumenti;
