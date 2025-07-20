
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
        
        public IEnumerable<object> GetJoinedArtiklsData()
        {
            return _repository.GetJoinedArtiklsData();
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
        public async Task<List<Nacin_Placanja>> DohvatiSveNacinePlacanjaAsync()
        {
            return await _repository.DohvatiSveNacinePlacanjaAsync();
        }
        public async Task<bool> DodajStatusDokumentaAsync(StatusDokumenta status)
        {
            return await _repository.DodajStatusDokumentaAsync(status);
        }
        public Task<bool> UrediStatusAsync(StatusDokumenta status)
        {
            return _repository.UrediStatusAsync(status);
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

    }
}
