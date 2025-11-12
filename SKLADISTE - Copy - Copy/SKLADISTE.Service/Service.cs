
//using Skladiste.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Skladiste.Model;
using SKLADISTE.DAL.DataModel;
using SKLADISTE.Repository.Common;
using SKLADISTE.Service.Common;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SKLADISTE.Service
{
    public class Service : IService
    {
        private readonly IRepository _repository;
        private readonly UserManager<ApplicationUser> _userManager;


        public Service(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<(string UserName, string FirstName, string LastName)> GetUserDetailsAsync(string userId)
        {
            return await _repository.GetUserDetailsByIdAsync(userId);
        }
        public async Task DeleteUserByIdAsync(string userId)
        {
            await _repository.DeleteUserByIdAsync(userId);
        }
        public async Task<List<(string Id, string Username )>> GetAllUserIdsAndUsernamesAsync()
        {
            return await _repository.GetAllUserIdsAndUsernamesAsync();
        }
        public async Task<bool> UpdateUserAsync(string userId, string firstName, string lastName, string userName)
        {
            // You can add validation or business logic here if needed
            if (string.IsNullOrEmpty(firstName) || string.IsNullOrEmpty(lastName))
            {
                throw new ArgumentException("First name and last name cannot be empty.");
            }

            return await _repository.UpdateUserAsync(userId, firstName, lastName,userName);
        }
        public IEnumerable<object> GetAllArtiklsDb()
         {
             IEnumerable<object> artiklDb = _repository.GetAllArtiklsDb();
             return artiklDb;
         }
       
        public async Task<List<UkupnaStanjaView>> getUkupnaStanjaView()
        {
            return await _repository.GetUkupnaStanjaView();
        }
        public async Task<List<UkupnaArhiviranaStanjaView>> GetUkupnaArhiviranaStanjaViews()
        {
            return await _repository.GetUkupnaArhiviranaStanjaView();
        }
        public async Task<List<ViewPrimkeBezLokacije>> GetPrimkeBezLokacijeAsync()
        {
            return await _repository.GetPrimkeBezLokacijeAsync();
        }
        public IEnumerable<object> GetJoinedArtiklsData()
        {
            return _repository.GetJoinedArtiklsData();
        }
        public IEnumerable<object> GetJoinedArtiklsDataById(int dokumentId)
        {
            return _repository.GetJoinedArtiklsDataById(dokumentId);
        }
        public IEnumerable<object> GetJoinedDataDateOrder()
        {
            return _repository.GetJoinedDataDateOrder();
        }
        public IEnumerable<object> GetJoinedDokumentTip()
        {
            return _repository.GetJoinedDokumentTip();
        }
        public IEnumerable<object> GetFIFOlist(int artiklId)
        {
            return _repository.GetFIFOlist(artiklId);
        }
        public IEnumerable<object> GetModalGraphInfo(int artiklId)
        {
            return _repository.GetModalGraphInfo(artiklId);
        }

        public async Task<bool> UpdateTrenutnaKolicinaAsync(int artiklId, int dokumentId, int newKolicina)
        {
            return await _repository.UpdateTrenutnaKolicinaAsync(artiklId, dokumentId, newKolicina);
        }
        public async Task<bool> UpdateArtiklAsync(int artiklId, string artiklNaziv, string artiklJmj, int kategorijaId)
        {
            return await _repository.UpdateArtiklAsync(artiklId, artiklNaziv, artiklJmj, kategorijaId);
        }


        public async Task<bool> AddArtiklAsync(Artikl artikl)
        {
            return await _repository.AddArtiklAsync(artikl);
        }
        public async Task<bool> mailerAsync(MailerDTO mailerDTO)
        {
            return await _repository.mailerAsync(mailerDTO);
        }
        public async Task<bool> AddDokumentAsync(Dokument dokument)
        {
            return await _repository.AddDokumentAsync(dokument);
        }
        public async Task<bool> AddKategorijaAsync(Kategorija kat)
        {
            return await _repository.AddKategorijaAsync(kat);
        }
        public async Task<bool> AddArtiklDokumenta(ArtikliDokumenata artDok)
        {
            return await _repository.AddArtiklDokumentaAsync(artDok);
        }

        public async Task<bool> UpdateArtiklDokumentaAsync(int dokumentId, int artiklId, float kolicina, float cijena)
        {
            return await _repository.UpdateArtiklDokumentaAsync(dokumentId, artiklId, kolicina, cijena);
        }

        public async Task<IEnumerable<ArtikliDokumenata>> GetAllArtikliDokumenataAsync()
        {
            return await _repository.GetAllArtikliDokumenataAsync();
        }

        public async Task<ArtikliDokumenata?> GetArtikliDokumentaByIdAsync(int id)
        {
            return await _repository.GetArtikliDokumentaByIdAsync(id);
        }

        public IEnumerable<Kategorija> GetAllKategorijeS()
        {
            IEnumerable<Kategorija> artiklDb = _repository.GetAllKategorije();
            return artiklDb;
        }
        public async Task<bool> DeleteArtiklAsync(int artiklId)
        {
            return await _repository.DeleteArtiklAsync(artiklId);
        }
        public IEnumerable<object> GetJoinedNarudzbenice()
        {
            return _repository.GetJoinedNarudzbenice();
        }


        public async Task<IEnumerable<object>> GetArtikliByDokumentIdAsync(int dokumentId)
        {
            return await _repository.GetArtikliByDokumentIdAsync(dokumentId);
        }
        public IEnumerable<StatusTip> GetAllStatusTipovi()
        {
            return _repository.GetAllStatusTipovi();
        }
        public IEnumerable<StatusDokumenta> GetAllStatusiDokumenata()
        {
            return _repository.GetAllStatusiDokumenata();
        }
        public async Task<bool> AddStatusDokumentaAsync(StatusDokumenta status)
        {
            return await _repository.AddStatusDokumentaAsync(status);
        }
        public IEnumerable<object> GetStatusiDokumentaByDokumentId(int dokumentId)
        {
            return _repository.GetStatusiDokumentaByDokumentId(dokumentId);
        }
        public async Task<List<Dobavljac>> GetAllDobavljaciAsync()
        {
            return await _repository.GetAllDobavljaciAsync();
        }
        public async Task<Dobavljac> GetDobavljacByIdAsync(int id)
        {
            return await _repository.GetDobavljacByIdAsync(id);
        }
        public async Task<bool> AddDobavljacAsync(Dobavljac dobavljac)
        {
            return await _repository.AddDobavljacAsync(dobavljac);
        }
        public async Task<bool> UpdateDobavljacAsync(Dobavljac dobavljac)
        {
            return await _repository.UpdateDobavljacAsync(dobavljac);
        }
        public async Task<bool> DeleteDobavljacAsync(int id)
        {
            return await _repository.DeleteDobavljacAsync(id);
        }
        public IEnumerable<object> GetDokumentiByDostavljacStatus(int dobavljacId)
        {
            IEnumerable<object> dokumenti = _repository.GetDokumentiByDostavljacStatus(dobavljacId);
            return dokumenti;
        }
        public async Task<IEnumerable<Dokument>> GetDokumentiByDobavljacIdAsync(int dobavljacId)
        {
            return await _repository.GetDokumentiByDobavljacIdAsync(dobavljacId);
        }

        public async Task<SkladistePodatci?> GetSkladisteAsync()
        {
            return await _repository.GetSkladisteAsync();
        }
        public async Task<bool> AddSkladisteAsync(SkladistePodatci skladiste)
        {
            return await _repository.AddSkladisteAsync(skladiste);
        }
        public async Task<bool> UpdateSkladisteAsync(SkladistePodatci skladiste)
        {
            return await _repository.UpdateSkladisteAsync(skladiste);
        }


        public async Task<bool> ObrisiDokumentAsync(int dokumentId)
        {
            return await _repository.ObrisiDokumentAsync(dokumentId);
        }
        public async Task<bool> KreirajNarudzbenicaDetaljeAsync(NarudzbenicaDetaljiCreateDto dto)
        {
            return await _repository.KreirajNarudzbenicaDetaljeAsync(dto);
        }
        public async Task<NarudzbenicaDetalji?> DohvatiNarudzbenicaDetaljeAsync(int dokumentId)
        {
            return await _repository.DohvatiNarudzbenicaDetaljeAsync(dokumentId);
        }
        public async Task<Dokument?> getDokument (int dokumentID)
        {
            return await _repository.getDokument(dokumentID);
        }
        public async Task<List<Nacin_Placanja>> DohvatiSveNacinePlacanjaAsync()
        {
            return await _repository.DohvatiSveNacinePlacanjaAsync();
        }
        public async Task<bool> DodajStatusDokumentaAsync(StatusDokumenta status)
        {
            return await _repository.DodajStatusDokumentaAsync(status);
        }
        public Task<bool> TestMail(naruMailerDTO TestDTO)
        {
            return _repository.TestMail(TestDTO);
        }
        public Task<bool> UrediStatusAsync(naruMailerDTO status)
        {
            return _repository.UrediStatusAsync(status);
        }
        public Task<bool> ZatvoriStatusAsync(StatusDokumenta status)
        {
            return _repository.ZatvoriStatusAsync(status);
        }
        public async Task<List<DokumentStatusDto>> GetDokumentStatusPairsAsync()
        {
            return await _repository.GetDokumentStatusPairsAsync();
        }
        public async Task KreirajVezuAsync(int primkaId, int narudzbenicaId)
        {
            await _repository.DodajVezuAsync(primkaId, narudzbenicaId);
        }
        public async Task<PrimkaInfoDto> GetPrimkaInfoByIdAsync(int primkaId)
        {
            return await _repository.GetPrimkaInfoByIdAsync(primkaId);
        }
        public async Task<IzdatnicaInfoDto> GetIzdatnicaInfoByIdAsync(int izdatnicaId)
        {
            return await _repository.GetIzdatnicaInfoByIdAsync(izdatnicaId);
        }
        public async Task<List<PrimNaruArtiklDto>> GetArtikliInfoByPrimkaId(int primkaId)
        {
            return await _repository.GetArtikliInfoByPrimkaId(primkaId);
        }

        public async Task<bool> AzurirajNarudzbenicaKolicineAsync(int narudzbenicaId, int primkaId)
        {
            return await _repository.AzurirajNarudzbenicaKolicineAsync(narudzbenicaId, primkaId);
        }

        public async Task<int> ObrisiStareOtvoreneNarudzbeniceAsync()
        {
            return await _repository.ObrisiStareOtvoreneNarudzbeniceAsync();
        }

        public IEnumerable<MonthlyStatsDto> GetMonthlyStats()
        {
            return _repository.GetMonthlyStats();
        }

        public IEnumerable<MonthlyStatsDto> GetMonthlyStatsForArtikl(int artiklId)
        {
            return _repository.GetMonthlyStatsForArtikl(artiklId);
        }

        public IEnumerable<DailyStatsDto> GetDailyStatsLast30Days()
        {
            return _repository.GetDailyStatsLast30Days();
        }

        public IEnumerable<DailyStatsDto> GetDailyStatsForMonth(int year, int month)
        {
            return _repository.GetDailyStatsForMonth(year, month);
        }

        public async Task<bool> UpdateRokIsporukeAsync(int dokumentId, DateTime rokIsporuke)
        {
            return await _repository.UpdateRokIsporukeAsync(dokumentId, rokIsporuke);
        }

        public async Task<int?> GetAktivniStatusIdAsync(int dokumentId)
        {
            return await _repository.GetAktivniStatusIdAsync(dokumentId);
        }

        public IEnumerable<MostSoldProductDto> GetMostSoldProducts()
        {
            return _repository.GetMostSoldProducts();
        }

        public IEnumerable<AverageStorageTimeDto> GetAverageStorageTimes()
        {
            return _repository.GetAverageStorageTimes();
        }
        public IEnumerable<Dokument> GetAllOtpis()
        {
            return _repository.GetAllOtpis();
        }
        public async Task<IEnumerable<ViewJoinedOtpis>> GetAllOtpisJoined()
        {
            return await _repository.GetAllOtpisJoined();
        }
        public async Task<OtpisInfoDTO> GetOtpisByIdAsync(int otpisId)
        {
            return await _repository.GetOtpisInfoByIdAsync(otpisId);
        }
        public async Task<bool> AddArhivaAsync(Arhive arhiva)
        {
            return await _repository.AddArhivaAsync(arhiva);
        }
        public async Task<bool> AddArhivaStanjeAsync(ArhiveStanja ArhiveStanja)
        {
            return await _repository.AddArhivaStanjeAsync(ArhiveStanja);    
        }

        public IEnumerable<Arhive> GetAllArhive()
        {
            return _repository.GetAllArhive();
        }

        public async Task<ArhiveDTO> GetArhiveByIdAsync(int arhivaId)
        {
            return await _repository.GetArhiveByIdAsync(arhivaId);
        }
        public async Task<bool> ArhivirajDokumenteByDatumAsync(SParhivirajDokumentePoDatumuDTO request)
        {
            return await _repository.ArhivirajDokumenteByDatum(request);
        }
        public async Task<List<DokumentByArhivaId>> GetDokumentiByArhivaIdAsync(int arhivaId)
        {
            return await _repository.GetDokumentiByArhivaIdAsync(arhivaId);
        }
        public async Task<List<GetStanjaByArhivaId>> GetStanjaByArhivaId(int arhivaId)
        {
            return await _repository.GetStanjaByArhivaId(arhivaId);
        }
        public async Task<bool> AddSkladisteLokacija(SkladisteLokacija sl)
        {
            return await _repository.AddSkladisteLokacija(sl);
        }
        public async Task<IEnumerable<SkladisteLokacija>> GetAllSkladisteLokacija()
        {
            return await _repository.GetAllSkladisteLokacija();
        }
        public async Task<bool> DeleteSkladisteLokacija(int sl_id)
        {
            return await _repository.DeleteSkladisteLokacija(sl_id);
        }
        public async Task<bool> UpdateSkladisteLokacija(SkladisteLokacija sl)
        {
            return await _repository.UpdateSkladisteLokacija(sl);
        }
        public async Task<IEnumerable<LokacijeArtikala>> GetAllLokacijeArtikala()
        {
            return await _repository.GetAllLokacijeArtikala();
        }

        public async Task<LokacijeArtikala> GetLokacijaArtiklaById(int id)
        {
            return await _repository.GetLokacijaArtiklaById(id);
        }

        public async Task<bool> AddLokacijaArtikla(LokacijeArtikala la)
        {
            return await _repository.AddLokacijaArtikla(la);
        }

        public async Task<bool> UpdateLokacijaArtikla(LokacijeArtikala la)
        {
            return await _repository.UpdateLokacijaArtikla(la);
        }

        public async Task<bool> DeleteLokacijaArtikla(int id)
        {
            return await _repository.DeleteLokacijaArtikla(id);
        }

    }
}
