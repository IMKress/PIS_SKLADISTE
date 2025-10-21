import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginForm from './Login';
import RegisterForm from './assets/Register';
import Navigacija from './assets/login_register_navbar'; // <-- layout
import PocetnaStranica from './assets/PocetnaStranica';
import Pocetna from './assets/Pocetna';
import Stanja from './assets/Stanja';
import DodajNoviArtikl from './assets/DodajNoviArtikl';
import Primka from './assets/Primka';
import Dokumenti from './assets/Dokumenti';
import Izdatnice from './assets/Izdatnica';
import Statistika from './assets/Statistika';
import Zaposlenici from './assets/zaposlenici';
import DodajKategoriju from './assets/DodajKategoriju';
import ArtiklInfo from './assets/ArtiklInfo'; // prilagodi ako je path drukčiji
import Narudzbenice from './assets/Narudzbenice';
import NarudzbenicaNova from './assets/NarudzbenicaNova';
import PregledNarudzbenice from './assets/PregledNarudzbenice';
import NarudzbenicaDetalji from './assets/NarudzbenicaDetalji';
import DokumentInfo from './assets/DokumentInfo';
import Dobavljaci from './assets/dobavljaci';
import DobavljaciDokumenti from './assets/dobavljaciDokumenti';
import AzurirajDobavljaca from './assets/AzurirajDobavljaca';
import DodajDobavljaca from './assets/DodajDobavljaca';
import PrimkaNova from './assets/PrimkaNova';
import IzdatnicaArtikliPage from './assets/IzdatnicaArtikliPage';
import PodatciSkladista from './assets/PodatciSkladista';
import Otpisi from './assets/Otpisi';
import NoviOtpis from './assets/NoviOtpis'
import NoviOtpisPregled from './assets/NoviOtpisPregled';
import OtpisDokumentInfo from './assets/OtpisDokumentInfo';
import Arhive from './assets/Arhive';
import ArhivaInfo from './assets/ArhivaInfo';
function App() {
  return (
    <Router>
      <Routes>
        {/* Login & Register routes OUTSIDE layout */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected routes INSIDE layout */}
        <Route path="/" element={<Navigacija />}>
          <Route path="pocetna" element={<Pocetna />} />
          <Route path="pocetnastranica" element={<PocetnaStranica />} />
          <Route path="stanja" element={<Stanja />} />
          <Route path="DodajNoviArtikl" element={<DodajNoviArtikl />} />
          <Route path="primka" element={<Primka />} />
          <Route path="dokumenti" element={<Dokumenti />} />
          <Route path="izdatnica" element={<Izdatnice />} />
          <Route path="IzdatnicaArtikliPage" element={<IzdatnicaArtikliPage />} />
          <Route path="Otpisi" element={<Otpisi />} />
          <Route path="NoviOtpis" element={<NoviOtpis />} />
          <Route path="NoviOtpisPregled" element={<NoviOtpisPregled />} />
          <Route path="OtpisDokumentInfo/:id" element={<OtpisDokumentInfo />} />
          <Route path="Arhive" element={<Arhive />} />
          <Route path="ArhivaInfo/:id" element={<ArhivaInfo />} />

          <Route path="statistika" element={<Statistika />} />
          <Route path="/dodajkategoriju" element={<DodajKategoriju />} />
          <Route path="/artikl/:id" element={<ArtiklInfo />} />
          <Route path="/Narudzbenice" element={<Narudzbenice />} />
          <Route path="/NarudzbenicaNova" element={<NarudzbenicaNova />} />
          <Route path="/pregled-narudzbenice" element={<PregledNarudzbenice />} />
          <Route path="/narudzbenica/:id" element={<NarudzbenicaDetalji />} />
          <Route path="/dokument-info/:id" element={<DokumentInfo />} />
          <Route path="/Dobavljaci" element={<Dobavljaci />} />
          <Route path="/dobavljac/:dobavljacId/dokumenti" element={<DobavljaciDokumenti />} />
          <Route path="/dobavljaci/azuriraj/:dobavljacId" element={<AzurirajDobavljaca />} />
          <Route path="/dobavljaci/novi" element={<DodajDobavljaca />} />
          <Route path="/PrimkaNova" element={<PrimkaNova />} />
          <Route path="/SkladistePodaci" element={<PodatciSkladista />} />


          <Route path="zaposlenici" element={<Zaposlenici />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
