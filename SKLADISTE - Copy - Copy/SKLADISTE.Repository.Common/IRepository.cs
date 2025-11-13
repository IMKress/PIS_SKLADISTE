using Microsoft.AspNetCore.Identity;
using Skladiste.Model;
using SKLADISTE.DAL.DataModel;
//using Skladiste.Model;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SKLADISTE.Repository.Common
{
    public interface IRepository
    {
        Task<(string UserName, string FirstName, string LastName)> GetUserDetailsByIdAsync(string userId);
        Task DeleteUserByIdAsync(string userId);
        Task<List<(string Id, string Username)>> GetAllUserIdsAndUsernamesAsync();
        Task<bool> UpdateUserAsync(string userId, string firstName, string lastName, string userName);
        IEnumerable<object> GetAllArtiklsDb();
        Task<List<UkupnaStanjaView>> GetUkupnaStanjaView();
        Task<List<UkupnaArhiviranaStanjaView>> GetUkupnaArhiviranaStanjaView();
        Task<List<ViewPrimkeBezLokacije>> GetPrimkeBezLokacijeAsync();

        IEnumerable<object> GetJoinedArtiklsData();
        IEnumerable<object> GetJoinedArtiklsDataById(int dokumentId);
        IEnumerable<object> GetJoinedDataDateOrder();

        public IEnumerable<object> GetJoinedDokumentTip();
        public IEnumerable<FIFOListResult> GetFIFOlist(int artiklId);
        IEnumerable<object> GetModalGraphInfo(int artiklId);
        Task<bool> UpdateTrenutnaKolicinaAsync(int artiklId, int dokumentId, int newKolicina);
        Task<bool> UpdateArtiklAsync(int artiklId, string artiklNaziv, string artiklJmj, int kategorijaId, int? malaKolicinaGranica);
        Task<bool> AddArtiklAsync(Artikl artikl);
        Task<bool> AddKategorijaAsync(Kategorija kat);
        Task<bool> mailerAsync(MailerDTO mailerDTO);

        Task<bool> AddDokumentAsync(Dokument dokument);
        Task<bool> AddArtiklDokumentaAsync(ArtikliDokumenata artDok);

        Task<bool> UpdateArtiklDokumentaAsync(int dokumentId, int artiklId, float kolicina, float cijena);
        Task<IEnumerable<ArtikliDokumenata>> GetAllArtikliDokumenataAsync();
        Task<ArtikliDokumenata?> GetArtikliDokumentaByIdAsync(int id);

        IEnumerable<Kategorija> GetAllKategorije();
        Task<bool> DeleteArtiklAsync(int artiklId);

        IEnumerable<object> GetJoinedNarudzbenice();
        Task<IEnumerable<object>> GetArtikliByDokumentIdAsync(int dokumentId);
        IEnumerable<StatusTip> GetAllStatusTipovi();
        IEnumerable<StatusDokumenta> GetAllStatusiDokumenata();
        Task<bool> AddStatusDokumentaAsync(StatusDokumenta status);
        IEnumerable<object> GetStatusiDokumentaByDokumentId(int dokumentId);
        //dobavljaci get 
        Task<List<Dobavljac>> GetAllDobavljaciAsync();
        Task<Dobavljac> GetDobavljacByIdAsync(int id);
        Task<bool> AddDobavljacAsync(Dobavljac dobavljac);
        Task<bool> UpdateDobavljacAsync(Dobavljac dobavljac);
        Task<bool> DeleteDobavljacAsync(int id);

        Task<SkladistePodatci?> GetSkladisteAsync();
        Task<bool> AddSkladisteAsync(SkladistePodatci skladiste);
        Task<bool> UpdateSkladisteAsync(SkladistePodatci skladiste);
        IEnumerable<object> GetDokumentiByDostavljacStatus(int dobavljacId);
        Task<IEnumerable<Dokument>> GetDokumentiByDobavljacIdAsync(int dobavljacId);

        Task<bool> ObrisiDokumentAsync(int dokumentId);
        Task<bool> KreirajNarudzbenicaDetaljeAsync(NarudzbenicaDetaljiCreateDto dto);
        Task<NarudzbenicaDetalji> DohvatiNarudzbenicaDetaljeAsync(int dokumentId);
        Task<Dokument> getDokument(int dokumentId);

        Task<List<Nacin_Placanja>> DohvatiSveNacinePlacanjaAsync();
        Task<bool> DodajStatusDokumentaAsync(StatusDokumenta status);
        Task<bool> TestMail(naruMailerDTO testDTO);

        Task<bool> UrediStatusAsync(naruMailerDTO status);
        Task<bool> ZatvoriStatusAsync(StatusDokumenta status);

        Task<List<DokumentStatusDto>> GetDokumentStatusPairsAsync();
        Task DodajVezuAsync(int primkaId, int narudzbenicaId);
        Task<PrimkaInfoDto> GetPrimkaInfoByIdAsync(int primkaId);
        Task<IzdatnicaInfoDto> GetIzdatnicaInfoByIdAsync(int izdatnicaId);

        Task<List<PrimNaruArtiklDto>> GetArtikliInfoByPrimkaId(int primkaId);

        Task<bool> AzurirajNarudzbenicaKolicineAsync(int narudzbenicaId, int primkaId);
        Task<int> ObrisiStareOtvoreneNarudzbeniceAsync();

        IEnumerable<MonthlyStatsDto> GetMonthlyStats();
        IEnumerable<MonthlyStatsDto> GetMonthlyStatsForArtikl(int artiklId);

        IEnumerable<DailyStatsDto> GetDailyStatsLast30Days();
        IEnumerable<DailyStatsDto> GetDailyStatsForMonth(int year, int month);

        Task<bool> UpdateRokIsporukeAsync(int dokumentId, DateTime rokIsporuke);
        Task<int?> GetAktivniStatusIdAsync(int dokumentId);
        IEnumerable<MostSoldProductDto> GetMostSoldProducts();
        IEnumerable<AverageStorageTimeDto> GetAverageStorageTimes();
        IEnumerable<Dokument> GetAllOtpis();
        Task<IEnumerable<ViewJoinedOtpis>> GetAllOtpisJoined();
        Task<OtpisInfoDTO> GetOtpisInfoByIdAsync(int otpisId);
        Task<bool> AddArhivaAsync(Arhive arhiva);
        Task<bool> AddArhivaStanjeAsync(ArhiveStanja ArhiveStanja);
        IEnumerable<Arhive> GetAllArhive();
        Task<ArhiveDTO> GetArhiveByIdAsync(int arhivaId);
        Task<bool> ArhivirajDokumenteByDatum(SParhivirajDokumentePoDatumuDTO request);
        Task<List<DokumentByArhivaId>> GetDokumentiByArhivaIdAsync(int arhivaId);
        Task<List<GetStanjaByArhivaId>> GetStanjaByArhivaId(int arhivaId);
        Task<bool> AddSkladisteLokacija(SkladisteLokacija sl);
        Task<IEnumerable<SkladisteLokacija>> GetAllSkladisteLokacija();
        Task<bool> DeleteSkladisteLokacija(int sl_id);
        Task<bool> UpdateSkladisteLokacija(SkladisteLokacija sl);
        Task<IEnumerable<LokacijeArtikala>> GetAllLokacijeArtikala();
        Task<LokacijeArtikala> GetLokacijaArtiklaById(int id);
        Task<bool> AddLokacijaArtikla(LokacijeArtikala la);
        Task<bool> UpdateLokacijaArtikla(LokacijeArtikala la);
        Task<bool> DeleteLokacijaArtikla(int id);
        Task<List<LokacijeArtiklaIzdatniceResult>> GetLokacijeArtiklaIzdatniceAsync(int artiklId, decimal kolicina);




        // IEnumerable<> GetAllArtiklsUlazDb();
        /*   IEnumerable<Artikl> GetAllArtiklsDb();
       IEnumerable<RobaStanje> GetAllArtiklsStanjeDb();
         IEnumerable<RobaUlaz> GetAllArtiklsUlazDb();
         IEnumerable<SkladisteDomain> GetAllArtiklsDomain();
         SkladisteDomain GetArtiklDomainByArtiklId(int artiklId);
         

         Task<bool> AddArtiklAsync(SkladisteDomain artikl);
         Task<bool> AddPrimkaAsync(RobaUlaz ulaz);
         Task<bool> UpdateRobaStanjeAsync(int idArtikla, RobaStanje updatedRobaStanjeDTO);*/



    }
}
