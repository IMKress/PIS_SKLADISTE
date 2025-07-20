using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Skladiste.Model;

//using Skladiste.Model;
using SKLADISTE.DAL.DataModel;
using SKLADISTE.Repository.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SKLADISTE.Repository
{
    public class Repository : IRepository
    {
        private readonly SkladisteKresonjaDbContext _appDbContext;
        private readonly UserManager<ApplicationUser> _userManager;


        public Repository(SkladisteKresonjaDbContext appDbContext, UserManager<ApplicationUser> userManager)
        {
            _appDbContext = appDbContext ?? throw new ArgumentNullException(nameof(appDbContext));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));


        }
        public async Task DeleteUserByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                await _userManager.DeleteAsync(user);
            }
        }
        public async Task<(string UserName, string FirstName, string LastName)> GetUserDetailsByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return (null, null, null);  // Return null if user is not found
            }

            // Return tuple with UserName, FirstName, and LastName
            return (user.UserName, user.FirstName, user.LastName);
        }
        public async Task<bool> UpdateUserAsync(string userId, string firstName, string lastName, string userName)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false; // User not found
            }

            // Update the user's properties
            user.FirstName = firstName;
            user.LastName = lastName;
            user.UserName = userName;

            // Save the changes using UserManager
            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public async Task<List<(string Id, string Username)>> GetAllUserIdsAndUsernamesAsync()
        {
            var users = await _userManager.Users.ToListAsync(); // Gets all users from the database
            return users.Select(u => (u.Id, u.UserName)).ToList();
        }

        //Artikli ispis(spojen sa kategorijom)
        public IEnumerable<object> GetAllArtiklsDb()
        {
            var joinedData = from art in _appDbContext.Artikli
                             join kat in _appDbContext.Kategorije on art.KategorijaId equals kat.KategorijaId
                             select new
                             {
                                 art.ArtiklId,
                                 art.ArtiklNaziv,
                                 art.ArtiklJmj,
                                 kat.KategorijaNaziv,
                                 art.ArtiklOznaka
                             };

            return joinedData.ToList();

        }


        //SPOJENI ISPIS DOKUMENTI, ARTIKLIDOKUMENTI, ARTIKLI, DOKUMENTTIPOVI
        public IEnumerable<object> GetJoinedArtiklsData()
        {
            var joinedData = from d in _appDbContext.Dokumenti
                             join ad in _appDbContext.ArtikliDokumenata on d.DokumentId equals ad.DokumentId
                             join a in _appDbContext.Artikli on ad.ArtiklId equals a.ArtiklId
                             join dt in _appDbContext.DokumentTipovi on d.TipDokumentaId equals dt.TipDokumentaId
                             select new
                             {
                                 d.DokumentId,
                                 d.OznakaDokumenta,
                                 d.DatumDokumenta,
                         
                                 dt.TipDokumenta,
                                 a.ArtiklId,
                                 a.ArtiklOznaka,
                                 a.ArtiklNaziv,
                                 a.ArtiklJmj,
                                 ad.Kolicina,
                                 ad.Cijena,
                                 ad.TrenutnaKolicina,
                                 ad.UkupnaCijena
                                 
                             };

            return joinedData.ToList();
        }

        //SPOJENI ISPIS DOKUMENTI, ARTIKLIDOKUMENTI, ARTIKLI, DOKUMENTTIPOVI
        public IEnumerable<object> GetJoinedDataDateOrder()
        {
            var joinedData = from d in _appDbContext.Dokumenti
                             join ad in _appDbContext.ArtikliDokumenata on d.DokumentId equals ad.DokumentId
                             join a in _appDbContext.Artikli on ad.ArtiklId equals a.ArtiklId
                             join dt in _appDbContext.DokumentTipovi on d.TipDokumentaId equals dt.TipDokumentaId
                             orderby d.DatumDokumenta // Sort by DatumDokumenta (oldest to newest)

                             select new
                             {
                                 d.DokumentId,
                                 d.DatumDokumenta,
                                 dt.TipDokumenta,
                                 a.ArtiklId,
                                 a.ArtiklNaziv,
                                 a.ArtiklJmj,
                                 ad.Kolicina,
                                 ad.Cijena,
                                 ad.TrenutnaKolicina,
                                 ad.UkupnaCijena
                             };

            return joinedData.ToList();
        }
        //SPOJENI ISPIS DOKUMENTI, ARTIKLIDOKUMENTI, ARTIKLI, DOKUMENTTIPOVI
        public IEnumerable<object> GetFIFOlist(int artiklId)
        {
            var joinedData = from d in _appDbContext.Dokumenti
                             join ad in _appDbContext.ArtikliDokumenata on d.DokumentId equals ad.DokumentId
                             where d.TipDokumentaId == 1 // TipDokumenta filter for Primka
                                   && ad.ArtiklId == artiklId  // Filter for ArtiklId
                             orderby d.DatumDokumenta // Sort by DatumDokumenta (oldest to newest)

                             select new
                             {
                                 d.DokumentId,
                                 d.TipDokumentaId,
                                 d.DatumDokumenta,
                                 ad.ArtiklId,
                                 ad.Kolicina,
                                 ad.TrenutnaKolicina,
                                 ad.Cijena
                             };

            return joinedData.ToList();
        }

        public IEnumerable<object> GetModalGraphInfo(int artiklId)
        {
            var joinedData = from d in _appDbContext.Dokumenti
                             join ad in _appDbContext.ArtikliDokumenata on d.DokumentId equals ad.DokumentId
                             where ad.ArtiklId == artiklId  // Filter for ArtiklId
                             orderby d.DatumDokumenta // Sort by DatumDokumenta (oldest to newest)

                             select new
                             {
                                 d.DokumentId,
                                 d.TipDokumentaId,
                                 d.DatumDokumenta,
                                 ad.ArtiklId,
                                 ad.Kolicina,
                                 ad.TrenutnaKolicina,
                                 ad.Cijena
                             };

            return joinedData.ToList();
        }


        //UPDATE KOLICINE
        public async Task<bool> UpdateTrenutnaKolicinaAsync(int artiklId, int dokumentId, int newKolicina)
        {
            var artikl = await _appDbContext.ArtikliDokumenata
                                            .FirstOrDefaultAsync(a => a.ArtiklId == artiklId && a.DokumentId == dokumentId);

            if (artikl != null)
            {
                artikl.TrenutnaKolicina = newKolicina;
                await _appDbContext.SaveChangesAsync();
                return true;
            }

            return false; // Artikl with the specified DokumentId not found
        }
        public async Task<bool> UpdateArtiklAsync(int artiklId, string artiklNaziv, string artiklJmj, int kategorijaId)
        {
            var artikl = await _appDbContext.Artikli.FindAsync(artiklId);
            if (artikl == null)
            {
                return false; // Artikl not found
            }

            // Update properties
            artikl.ArtiklNaziv = artiklNaziv;
            artikl.ArtiklJmj = artiklJmj;
            artikl.KategorijaId = kategorijaId;

            _appDbContext.Artikli.Update(artikl);
            await _appDbContext.SaveChangesAsync();
            return true;
        }



        //SPOJENI ISPIS ZA ISPIS DOKUMENATA I NJIHOVIH TIPOVA
        public IEnumerable<object> GetJoinedDokumentTip()
        {
            var joinedData = from d in _appDbContext.Dokumenti
                             join dt in _appDbContext.DokumentTipovi on d.TipDokumentaId equals dt.TipDokumentaId
                             select new
                             {
                                 d.DokumentId,
                                 d.DatumDokumenta,
                                 dt.TipDokumenta,
                                 d.ZaposlenikId
                                
                             };

            return joinedData.ToList();
        }

        //Dodavanje artikala
        public async Task<bool> AddArtiklAsync(Artikl artikl)
        {
            if (artikl == null) throw new ArgumentNullException(nameof(artikl));

            var kategorija = await _appDbContext.Kategorije
                .FirstOrDefaultAsync(k => k.KategorijaId == artikl.KategorijaId);

            var prefix = kategorija?.KategorijaNaziv?.FirstOrDefault().ToString().ToUpper() ?? "A";
            var rnd = new Random();
            artikl.ArtiklOznaka = $"{prefix}{rnd.Next(1000, 10000)}";

            await _appDbContext.Artikli.AddAsync(artikl);
            await _appDbContext.SaveChangesAsync();
            return true;
        }
       
        public async Task<bool> AddKategorijaAsync(Kategorija kat)
        {
            if (kat == null) throw new ArgumentNullException(nameof(kat));

            await _appDbContext.Kategorije.AddAsync(kat);
            await _appDbContext.SaveChangesAsync();
            return true;
        }
        //Dodavanje novoga dokumenta (primka ili izdatnica)

        public async Task<bool> AddDokumentAsync(Dokument dokument)
        {
            if (dokument == null) throw new ArgumentNullException(nameof(dokument));

            await _appDbContext.Dokumenti.AddAsync(dokument);
            await _appDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddArtiklDokumentaAsync(ArtikliDokumenata artDok)
        {
            if (artDok == null) throw new ArgumentNullException(nameof(artDok));

            bool exists = await _appDbContext.ArtikliDokumenata
                .AnyAsync(a => a.DokumentId == artDok.DokumentId && a.ArtiklId == artDok.ArtiklId);

            if (exists)
                return false;

            await _appDbContext.ArtikliDokumenata.AddAsync(artDok);
            await _appDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateArtiklDokumentaAsync(int dokumentId, int artiklId, float kolicina, float cijena)
        {
            var existing = await _appDbContext.ArtikliDokumenata
                .FirstOrDefaultAsync(a => a.DokumentId == dokumentId && a.ArtiklId == artiklId);

            if (existing == null)
                return false;

            existing.Kolicina = kolicina;
            existing.Cijena = cijena;
            existing.UkupnaCijena = kolicina * cijena;

            await _appDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ArtikliDokumenata>> GetAllArtikliDokumenataAsync()
        {
            return await _appDbContext.ArtikliDokumenata.ToListAsync();
        }

        public async Task<ArtikliDokumenata?> GetArtikliDokumentaByIdAsync(int id)
        {
            return await _appDbContext.ArtikliDokumenata.FirstOrDefaultAsync(a => a.Id == id);
        }
        //vracanje svih kategorija
        public IEnumerable<Kategorija> GetAllKategorije()
        {
            IEnumerable<Kategorija> artiklDb = _appDbContext.Kategorije.ToList();
            return artiklDb;
        }
        public async Task<bool> DeleteArtiklAsync(int artiklId)
        {
            var artikl = await _appDbContext.Artikli.FirstOrDefaultAsync(a => a.ArtiklId == artiklId);
            if (artikl == null)
            {
                return false;
            }
            _appDbContext.Artikli.Remove(artikl);
            await _appDbContext.SaveChangesAsync();
            return true;
        }

        public IEnumerable<object> GetJoinedNarudzbenice()
        {
            var joinedNarudzbenice = from d in _appDbContext.Dokumenti
                                     join dt in _appDbContext.DokumentTipovi on d.TipDokumentaId equals dt.TipDokumentaId
                                     where dt.TipDokumenta == "Narudzbenica"
                                     select new
                                     {
                                         d.DokumentId,
                                         d.DatumDokumenta,
                                         dt.TipDokumenta,
                                         d.ZaposlenikId,
                                          d.DobavljacId,
                                         d.Napomena,
                                         d.OznakaDokumenta
                                     };

            return joinedNarudzbenice.ToList();
        }
        public async Task<IEnumerable<object>> GetArtikliByDokumentIdAsync(int dokumentId)
        {
            var result = await _appDbContext.ArtikliDokumenata
                .Where(ad => ad.DokumentId == dokumentId)
                .Join(_appDbContext.Artikli,
                      ad => ad.ArtiklId,
                      a => a.ArtiklId,
                      (ad, a) => new
                      {
                          a.ArtiklId,
                          a.ArtiklOznaka,
                          a.ArtiklNaziv,
                          a.ArtiklJmj,
                          ad.Kolicina,
                          ad.Cijena,
                          ad.UkupnaCijena
                      })
                .ToListAsync();

            return result;
        }
        public IEnumerable<StatusTip> GetAllStatusTipovi()
        {
            return _appDbContext.StatusiTipova.ToList();
        }
        public IEnumerable<StatusDokumenta> GetAllStatusiDokumenata()
        {
            return _appDbContext.StatusiDokumenata
                .Include(s => s.StatusTip)
                .Include(s => s.Dokument)
                .ToList();
        }

        public async Task<bool> AddStatusDokumentaAsync(StatusDokumenta status)
        {
            if (status == null) return false;

            await _appDbContext.StatusiDokumenata.AddAsync(status);
            await _appDbContext.SaveChangesAsync();
            return true;
        }
        public IEnumerable<object> GetStatusiDokumentaByDokumentId(int dokumentId)
        {
            var data = from sd in _appDbContext.StatusiDokumenata
                       join st in _appDbContext.StatusiTipova on sd.StatusId equals st.StatusId
                       where sd.DokumentId == dokumentId
                       orderby sd.Datum
                       select new
                       {
                           sd.DokumentId,
                           sd.StatusId,
                           sd.Datum,
                           sd.aktivan,
                           StatusNaziv = st.StatusNaziv
                       };

            return data.ToList();
        }
        //dobavljaci get
        public async Task<List<Dobavljac>> GetAllDobavljaciAsync()
        {
            return await _appDbContext.Dobavljaci.ToListAsync();
        }
        public async Task<Dobavljac> GetDobavljacByIdAsync(int id)
        {
            return await _appDbContext.Dobavljaci.FirstOrDefaultAsync(d => d.DobavljacId == id);
        }
        public async Task<bool> AddDobavljacAsync(Dobavljac dobavljac)
        {
            try
            {
                await _appDbContext.Dobavljaci.AddAsync(dobavljac);
                await _appDbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
        public async Task<bool> UpdateDobavljacAsync(Dobavljac dobavljac)
        {
            var existing = await _appDbContext.Dobavljaci.FindAsync(dobavljac.DobavljacId);

            if (existing == null)
                return false;

            existing.DobavljacNaziv = dobavljac.DobavljacNaziv;
            existing.AdresaDobavljaca = dobavljac.AdresaDobavljaca;
            existing.brojTelefona = dobavljac.brojTelefona;
            existing.Email = dobavljac.Email;

            try
            {
                _appDbContext.Dobavljaci.Update(existing);
                await _appDbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
        public async Task<bool> DeleteDobavljacAsync(int id)
        {
            var dobavljac = await _appDbContext.Dobavljaci.FindAsync(id);

            if (dobavljac == null)
                return false;

            try
            {
                _appDbContext.Dobavljaci.Remove(dobavljac);
                await _appDbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
        public async Task<IEnumerable<Dokument>> GetDokumentiByDobavljacIdAsync(int dobavljacId)
        {
            return await _appDbContext.Dokumenti
                .Where(d => d.DobavljacId == dobavljacId)
                .Include(d => d.TipDokumenta)
                .Include(d => d.StatusDokumenta)
                .ToListAsync();
        }

        public async Task<SkladistePodatci?> GetSkladisteAsync()
        {
            return await _appDbContext.SkladistePodatcis.FirstOrDefaultAsync();
        }

        public async Task<bool> AddSkladisteAsync(SkladistePodatci skladiste)
        {
            try
            {
                await _appDbContext.SkladistePodatcis.AddAsync(skladiste);
                await _appDbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> UpdateSkladisteAsync(SkladistePodatci skladiste)
        {
            var existing = await _appDbContext.SkladistePodatcis.FindAsync(skladiste.SkladisteId);
            if (existing == null)
                return false;

            existing.SkladisteNaziv = skladiste.SkladisteNaziv;
            existing.AdresaSkladista = skladiste.AdresaSkladista;
            existing.brojTelefona = skladiste.brojTelefona;
            existing.Email = skladiste.Email;

            try
            {
                _appDbContext.SkladistePodatcis.Update(existing);
                await _appDbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> ObrisiDokumentAsync(int dokumentId)
        {
            using var transaction = await _appDbContext.Database.BeginTransactionAsync();

            try
            {
                var dokument = await _appDbContext.Dokumenti.FindAsync(dokumentId);
                if (dokument == null)
                    return false;

                var tipId = dokument.TipDokumentaId;

                // 1. Briši artikle i statuse vezane za dokument
                var artikli = await _appDbContext.ArtikliDokumenata
                    .Where(a => a.DokumentId == dokumentId)
                    .ToListAsync();
                _appDbContext.ArtikliDokumenata.RemoveRange(artikli);

                var statusi = await _appDbContext.StatusiDokumenata
                    .Where(s => s.DokumentId == dokumentId)
                    .ToListAsync();
                _appDbContext.StatusiDokumenata.RemoveRange(statusi);

                if (tipId == 1002) // Narudžbenica
                {
                    // 2. Obriši detalje narudžbenice
                    var detalji = await _appDbContext.NarudzbenicaDetalji.FindAsync(dokumentId);
                    if (detalji != null)
                        _appDbContext.NarudzbenicaDetalji.Remove(detalji);

                    // 3. Nađi sve veze gdje je NarudzbenicaId == dokumentId
                    var vezeNarudzbenice = await _appDbContext.PrimNaruVeze
                        .Where(v => v.NarudzbenicaId == dokumentId)
                        .ToListAsync();

                    foreach (var veza in vezeNarudzbenice)
                    {
                        var primkaId = veza.PrimkaId;

                        // 4. Obriši sve što je vezano za PRIMKU
                        var artikliPrimke = await _appDbContext.ArtikliDokumenata
                            .Where(a => a.DokumentId == primkaId)
                            .ToListAsync();
                        _appDbContext.ArtikliDokumenata.RemoveRange(artikliPrimke);

                        var statusiPrimke = await _appDbContext.StatusiDokumenata
                            .Where(s => s.DokumentId == primkaId)
                            .ToListAsync();
                        _appDbContext.StatusiDokumenata.RemoveRange(statusiPrimke);

                        var vezePrimke = await _appDbContext.PrimNaruVeze
                            .Where(p => p.PrimkaId == primkaId)
                            .ToListAsync();
                        _appDbContext.PrimNaruVeze.RemoveRange(vezePrimke);

                        var primka = await _appDbContext.Dokumenti.FindAsync(primkaId);
                        if (primka != null)
                            _appDbContext.Dokumenti.Remove(primka);
                    }

                    // 5. Obriši sve veze za ovu narudžbenicu (TEK SADA!)
                    _appDbContext.PrimNaruVeze.RemoveRange(vezeNarudzbenice);
                }
                else if (tipId == 1) // Primka
                {
                    var veze = await _appDbContext.PrimNaruVeze
                        .Where(v => v.PrimkaId == dokumentId)
                        .ToListAsync();
                    _appDbContext.PrimNaruVeze.RemoveRange(veze);
                }

                // 6. Na kraju, obriši sam dokument
                _appDbContext.Dokumenti.Remove(dokument);

                // 7. Spremi sve i commitaj transakciju
                await _appDbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine("Greška prilikom brisanja dokumenta: " + ex.Message);
                throw;
            }
        }

        public async Task<bool> KreirajNarudzbenicaDetaljeAsync(NarudzbenicaDetaljiCreateDto dto)
        {
            var postoji = await _appDbContext.NarudzbenicaDetalji
                .AnyAsync(x => x.DokumentId == dto.DokumentId);

            if (postoji)
                return false;

            var novi = new NarudzbenicaDetalji
            {
                DokumentId = dto.DokumentId,
                NP_Id = dto.NP_Id,
                MjestoIsporuke = dto.MjestoIsporuke,
                RokIsporuke = dto.RokIsporuke
            };

            _appDbContext.NarudzbenicaDetalji.Add(novi);
            await _appDbContext.SaveChangesAsync();
            return true;
        }
        public async Task<NarudzbenicaDetalji> DohvatiNarudzbenicaDetaljeAsync(int dokumentId)
        {
            return await _appDbContext.NarudzbenicaDetalji
                .FirstOrDefaultAsync(d => d.DokumentId == dokumentId);
        }
        public async Task<List<Nacin_Placanja>> DohvatiSveNacinePlacanjaAsync()
        {
            return await _appDbContext.NaciniPlacanja.ToListAsync();
        }
        public async Task<bool> DodajStatusDokumentaAsync(StatusDokumenta status)
        {
            _appDbContext.StatusiDokumenata.Add(status);
            return await _appDbContext.SaveChangesAsync() > 0;
        }
        public async Task<bool> UrediStatusAsync(StatusDokumenta noviStatus)
        {
            // Provjera postoji li traženi status u referenciranoj tablici Status (StatusId)
            var statusPostoji = await _appDbContext.StatusiTipova.AnyAsync(s => s.StatusId == noviStatus.StatusId);
            if (!statusPostoji)
                return false;

            // Postavi sve prethodne statuse za taj dokument kao neaktivne
            var stariStatusi = _appDbContext.StatusiDokumenata
                .Where(s => s.DokumentId == noviStatus.DokumentId && s.aktivan);

            await stariStatusi.ForEachAsync(s => s.aktivan = false);

            // Dodaj novi aktivni status
            var novi = new StatusDokumenta
            {
                DokumentId = noviStatus.DokumentId,
                StatusId = noviStatus.StatusId,
                Datum = noviStatus.Datum,
                ZaposlenikId = noviStatus.ZaposlenikId,
                aktivan = true
            };

            await _appDbContext.StatusiDokumenata.AddAsync(novi);
            await _appDbContext.SaveChangesAsync();

            return true;
        }
        public async Task<List<DokumentStatusDto>> GetDokumentStatusPairsAsync()
        {
            return await _appDbContext.StatusiDokumenata
                .Select(s => new DokumentStatusDto
                {
                    DokumentId = s.DokumentId,
                    StatusId = s.StatusId,
                    aktivan=s.aktivan
                })
                .ToListAsync();
        }
        public async Task DodajVezuAsync(int primkaId, int narudzbenicaId)
        {
            // Provjera postoji li već veza
            var postoji = await _appDbContext.PrimNaruVeze
                .AnyAsync(p => p.PrimkaId == primkaId && p.NarudzbenicaId == narudzbenicaId);

            if (postoji)
                throw new InvalidOperationException("Veza između primke i narudžbenice već postoji.");

            // Kreiranje nove veze
            var veza = new PrimNaruVeze
            {
                PrimkaId = primkaId,
                NarudzbenicaId = narudzbenicaId
            };

            await _appDbContext.PrimNaruVeze.AddAsync(veza);
            await _appDbContext.SaveChangesAsync();
        }
        public async Task<PrimkaInfoDto> GetPrimkaInfoByIdAsync(int primkaId)
        {
            var dokument = await _appDbContext.Dokumenti
                .Where(d => d.DokumentId == primkaId && d.TipDokumentaId == 1)
                .Select(d => new PrimkaInfoDto
                {
                    DokumentId = d.DokumentId,
                    Dostavio=d.Dostavio,
                    DatumDokumenta = d.DatumDokumenta,
                    TipDokumenta = "Primka",
                    ZaposlenikId = d.ZaposlenikId,
                    OznakaDokumenta = d.OznakaDokumenta,
                    NarudzbenicaId = _appDbContext.PrimNaruVeze
                        .Where(p => p.PrimkaId == d.DokumentId)
                        .Select(p => (int?)p.NarudzbenicaId)
                        .FirstOrDefault(),
                    Napomena=d.Napomena
                })
                .FirstOrDefaultAsync();

            return dokument;
        }
        public async Task<IzdatnicaInfoDto> GetIzdatnicaInfoByIdAsync(int izdatnicaId)
        {
            var dokument = await _appDbContext.Dokumenti
                .Where(d => d.DokumentId == izdatnicaId && d.TipDokumentaId == 2)
                .Select(d => new IzdatnicaInfoDto
                {
                    DokumentId = d.DokumentId,
                    DatumDokumenta = d.DatumDokumenta,
                    TipDokumenta = "Izdatnica",
                    ZaposlenikId = d.ZaposlenikId,
                    OznakaDokumenta = d.OznakaDokumenta,
                    MjestoTroska = d.MjestoTroska,
                    Napomena=d.Napomena
                })
                .FirstOrDefaultAsync();

            return dokument;
        }
        public async Task<List<PrimNaruArtiklDto>> GetArtikliInfoByPrimkaId(int primkaId)
        {
            var veza = await _appDbContext.PrimNaruVeze
                .FirstOrDefaultAsync(p => p.PrimkaId == primkaId);

            if (veza == null)
                return new List<PrimNaruArtiklDto>();

            var artikli = await _appDbContext.ArtikliDokumenata
                .Where(ad => ad.DokumentId == veza.NarudzbenicaId)
                .Select(ad => new PrimNaruArtiklDto
                {
                    NarudzbenicaId = veza.NarudzbenicaId,
                    PrimkaId = veza.PrimkaId,
                    ArtiklId = ad.ArtiklId,
                    Kolicina = ad.Kolicina
                })
                .ToListAsync();

            return artikli;
        }

        public async Task<bool> AzurirajNarudzbenicaKolicineAsync(int narudzbenicaId, int primkaId)
        {
            var primkaArtikli = await _appDbContext.ArtikliDokumenata
                .Where(ad => ad.DokumentId == primkaId)
                .ToListAsync();

            foreach (var pArt in primkaArtikli)
            {
                var narArt = await _appDbContext.ArtikliDokumenata
                    .FirstOrDefaultAsync(ad => ad.DokumentId == narudzbenicaId && ad.ArtiklId == pArt.ArtiklId);

                if (narArt != null)
                {
                    narArt.TrenutnaKolicina += pArt.TrenutnaKolicina;
                }
            }

            await _appDbContext.SaveChangesAsync();

            // Provjeri jesu li sve stavke narudžbenice u potpunosti isporučene
            var narudzbenicaZavrsena = await _appDbContext.ArtikliDokumenata
                .Where(ad => ad.DokumentId == narudzbenicaId)
                .AllAsync(ad => ad.TrenutnaKolicina >= ad.Kolicina);

            if (narudzbenicaZavrsena)
            {
                // Deaktiviraj stare statuse
                var stariStatusi = _appDbContext.StatusiDokumenata
                    .Where(s => s.DokumentId == narudzbenicaId && s.aktivan);

                await stariStatusi.ForEachAsync(s => s.aktivan = false);

                // Dohvati zaposlenika s primke kako bi se zabilježilo tko je zatvorio narudžbenicu
                var zaposlenikId = await _appDbContext.Dokumenti
                    .Where(d => d.DokumentId == primkaId)
                    .Select(d => d.ZaposlenikId)
                    .FirstOrDefaultAsync();

                var noviStatus = new StatusDokumenta
                {
                    DokumentId = narudzbenicaId,
                    StatusId = 2, // 2 = zatvorena
                    Datum = DateTime.Now,
                    ZaposlenikId = zaposlenikId,
                    aktivan = true
                };

                await _appDbContext.StatusiDokumenata.AddAsync(noviStatus);
                await _appDbContext.SaveChangesAsync();
            }

            return true;
        }
        public async Task<int> ObrisiStareOtvoreneNarudzbeniceAsync()
        {
            var cutoff = DateTime.Now.AddDays(-1);
            var otvorene = await _appDbContext.Dokumenti
                .Where(d => d.DatumDokumenta <= cutoff)
                .Join(_appDbContext.DokumentTipovi.Where(t => t.TipDokumenta == "Narudzbenica"),
                      d => d.TipDokumentaId,
                      dt => dt.TipDokumentaId,
                      (d, dt) => d)
                .Join(_appDbContext.StatusiDokumenata.Where(s => s.aktivan),
                      d => d.DokumentId,
                      sd => sd.DokumentId,
                      (d, sd) => new { Dokument = d, sd.StatusId })
                .Join(_appDbContext.StatusiTipova,
                      ds => ds.StatusId,
                      st => st.StatusId,
                      (ds, st) => new { ds.Dokument, st.StatusNaziv })
                .Where(x => x.StatusNaziv.ToLower() == "otvorena" ||
                             x.StatusNaziv.ToLower() == "otvoren")
                .Select(x => x.Dokument)
                .ToListAsync();

            foreach (var dok in otvorene)
            {
                await ObrisiDokumentAsync(dok.DokumentId);
            }

            return otvorene.Count;
        }

        public async Task<bool> UpdateRokIsporukeAsync(int dokumentId, DateTime rokIsporuke)
        {
            var detalji = await _appDbContext.NarudzbenicaDetalji.FindAsync(dokumentId);
            if (detalji == null) return false;
            detalji.RokIsporuke = rokIsporuke;
            await _appDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<int?> GetAktivniStatusIdAsync(int dokumentId)
        {
            var status = await _appDbContext.StatusiDokumenata
                .Where(s => s.DokumentId == dokumentId && s.aktivan)
                .OrderByDescending(s => s.Datum)
                .FirstOrDefaultAsync();
            return status?.StatusId;
        }

        public IEnumerable<MonthlyStatsDto> GetMonthlyStats()
        {
            var startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(-11);

            var grouped = _appDbContext.ArtikliDokumenata
                .Join(
                    _appDbContext.Dokumenti,
                    ad => ad.DokumentId,
                    d => d.DokumentId,
                    (ad, d) => new { ad.UkupnaCijena, d.TipDokumentaId, d.DatumDokumenta })
                .Where(x => x.DatumDokumenta >= startDate)
                .GroupBy(x => new { x.DatumDokumenta.Year, x.DatumDokumenta.Month })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    Primke = g.Sum(x => x.TipDokumentaId == 1 ? x.UkupnaCijena : 0),
                    Izdatnice = g.Sum(x => x.TipDokumentaId == 2 ? x.UkupnaCijena : 0)
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToList();

            return grouped.Select(g => new MonthlyStatsDto
            {
                Mjesec = $"{g.Year}-{g.Month:D2}",
                Primke = (double)g.Primke,
                Izdatnice = (double)g.Izdatnice
            });

        }

        public IEnumerable<MonthlyStatsDto> GetMonthlyStatsForArtikl(int artiklId)
        {
            var grouped = _appDbContext.ArtikliDokumenata
                .Join(
                    _appDbContext.Dokumenti,
                    ad => ad.DokumentId,
                    d => d.DokumentId,
                    (ad, d) => new { ad.ArtiklId, ad.UkupnaCijena, d.TipDokumentaId, d.DatumDokumenta })
                .Where(x => x.ArtiklId == artiklId)
                .GroupBy(x => new { x.DatumDokumenta.Year, x.DatumDokumenta.Month })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    Primke = g.Sum(x => x.TipDokumentaId == 1 ? x.UkupnaCijena : 0),
                    Izdatnice = g.Sum(x => x.TipDokumentaId == 2 ? x.UkupnaCijena : 0)
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToList();

            return grouped.Select(g => new MonthlyStatsDto
            {
                Mjesec = $"{g.Year}-{g.Month:D2}",
                Primke = (double)g.Primke,
                Izdatnice = (double)g.Izdatnice
            });

        }

        public IEnumerable<DailyStatsDto> GetDailyStatsLast30Days()
        {
            var fromDate = DateTime.Now.Date.AddDays(-29);
            var toDate = DateTime.Now.Date;

            var grouped = _appDbContext.ArtikliDokumenata
                .Join(
                    _appDbContext.Dokumenti,
                    ad => ad.DokumentId,
                    d => d.DokumentId,
                    (ad, d) => new { ad.UkupnaCijena, d.TipDokumentaId, d.DatumDokumenta })
                .Where(x => x.DatumDokumenta.Date >= fromDate && x.DatumDokumenta.Date <= toDate)
                .GroupBy(x => x.DatumDokumenta.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Primke = g.Sum(x => x.TipDokumentaId == 1 ? x.UkupnaCijena : 0),
                    Izdatnice = g.Sum(x => x.TipDokumentaId == 2 ? x.UkupnaCijena : 0)
                })
                .OrderBy(x => x.Date)
                .ToList();

            return grouped.Select(g => new DailyStatsDto
            {
                Dan = g.Date.ToString("yyyy-MM-dd"),
                Primke = (double)g.Primke,
                Izdatnice = (double)g.Izdatnice
            });

        }

        public IEnumerable<DailyStatsDto> GetDailyStatsForMonth(int year, int month)
        {
            var grouped = _appDbContext.ArtikliDokumenata
                .Join(
                    _appDbContext.Dokumenti,
                    ad => ad.DokumentId,
                    d => d.DokumentId,
                    (ad, d) => new { ad.UkupnaCijena, d.TipDokumentaId, d.DatumDokumenta })
                .Where(x => x.DatumDokumenta.Year == year && x.DatumDokumenta.Month == month)
                .GroupBy(x => x.DatumDokumenta.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Primke = g.Sum(x => x.TipDokumentaId == 1 ? x.UkupnaCijena : 0),
                    Izdatnice = g.Sum(x => x.TipDokumentaId == 2 ? x.UkupnaCijena : 0)
                })
                .OrderBy(x => x.Date)
                .ToList();

            return grouped.Select(g => new DailyStatsDto
            {
                Dan = g.Date.ToString("yyyy-MM-dd"),
                Primke = (double)g.Primke,
                Izdatnice = (double)g.Izdatnice
            });

        }

        public IEnumerable<MostSoldProductDto> GetMostSoldProducts()
        {
            var query = from ad in _appDbContext.ArtikliDokumenata
                        join d in _appDbContext.Dokumenti on ad.DokumentId equals d.DokumentId
                        join a in _appDbContext.Artikli on ad.ArtiklId equals a.ArtiklId
                        where d.TipDokumentaId == 2
                        group ad by new { ad.ArtiklId, a.ArtiklNaziv } into g
                        orderby g.Sum(x => x.Kolicina) descending
                        select new MostSoldProductDto
                        {
                            ArtiklId = g.Key.ArtiklId,
                            ArtiklNaziv = g.Key.ArtiklNaziv,
                            TotalKolicina = g.Sum(x => x.Kolicina)
                        };

            return query.ToList();
        }

        public IEnumerable<AverageStorageTimeDto> GetAverageStorageTimes()
        {
            var artikli = _appDbContext.Artikli.ToList();

            var dokumenti = _appDbContext.Dokumenti
                .Where(d => d.TipDokumentaId == 1 || d.TipDokumentaId == 2) // 1 = Primka, 2 = Izdatnica
                .ToList();

            var artikliDokumenata = _appDbContext.ArtikliDokumenata
                .Include(ad => ad.Dokument)
                .ToList();

            var result = new List<AverageStorageTimeDto>();

            foreach (var artikl in artikli)
            {
                var primke = artikliDokumenata
                    .Where(ad => ad.ArtiklId == artikl.ArtiklId && ad.Dokument.TipDokumentaId == 1)
                    .Select(ad => new
                    {
                        Datum = ad.Dokument.DatumDokumenta,
                        Kolicina = ad.Kolicina
                    })
                    .OrderBy(p => p.Datum)
                    .ToList();

                var izdatnice = artikliDokumenata
                    .Where(ad => ad.ArtiklId == artikl.ArtiklId && ad.Dokument.TipDokumentaId == 2)
                    .Select(ad => new
                    {
                        Datum = ad.Dokument.DatumDokumenta,
                        Kolicina = ad.Kolicina
                    })
                    .OrderBy(i => i.Datum)
                    .ToList();

                double kolicinaPoDanu = 0;
                double Izdano = 0;

                var queue = new Queue<(DateTime Datum, double Kolicina)>(primke.Select(p => (p.Datum, (double)p.Kolicina)));

                foreach (var izd in izdatnice)
                {
                    double toIssue = izd.Kolicina;

                    while (toIssue > 0 && queue.Any())
                    {
                        var (primkaDate, primkaQty) = queue.Peek();
                        var usedQty = Math.Min(primkaQty, toIssue);
                        var duration = (izd.Datum - primkaDate).TotalDays;

                        kolicinaPoDanu += usedQty * duration;
                        Izdano += usedQty;

                        primkaQty -= usedQty;
                        toIssue -= usedQty;

                        queue.Dequeue();
                        if (primkaQty > 0)
                        {
                            queue.Enqueue((primkaDate, primkaQty)); // requeue remaining qty
                        }
                    }
                }

                result.Add(new AverageStorageTimeDto

                {
                    ArtiklId = artikl.ArtiklId,
                    ArtiklNaziv = artikl.ArtiklNaziv,
                    ProsjecniDani = Izdano > 0 ? kolicinaPoDanu / Izdano : 0
                });
            }

            return result;
        }

    }

}
