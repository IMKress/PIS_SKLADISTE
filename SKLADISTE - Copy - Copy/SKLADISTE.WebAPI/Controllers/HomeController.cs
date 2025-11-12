using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Skladiste.Model;
using Microsoft.EntityFrameworkCore;


//using Skladiste.Model;
using SKLADISTE.DAL.DataModel;
using SKLADISTE.Service.Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;



namespace SKLADISTE.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class HomeController : ControllerBase
    {
        private readonly SkladisteKresonjaDbContext _context;

        private readonly IService _service;

        public HomeController(IService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        [HttpGet("username/{userId}")]
        public async Task<IActionResult> GetUserDetails(string userId)
        {
            var (userName, firstName, lastName) = await _service.GetUserDetailsAsync(userId);

            if (userName == null)
            {
                return NotFound();
            }

            // Return the result as JSON
            return Ok(new
            {
                UserName = userName,
                FirstName = firstName,
                LastName = lastName
            });
        }

        [HttpGet("usernames")]
        public async Task<IActionResult> GetAllUserIdsAndUsernames()
        {
            var users = await _service.GetAllUserIdsAndUsernamesAsync();
            return Ok(users);
        }
        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                await _service.DeleteUserByIdAsync(id);
                return Ok(new { Message = "User deleted successfully." });
            }
            catch (Exception ex)
            {
                // Log the exception details here
                return StatusCode(500, new { Message = "An error occurred while deleting the user.", Error = ex.Message });
            }
        }

        [HttpPut("update-user/{userId}")]
        public async Task<IActionResult> UpdateUser(string userId, [FromBody] UpdateUserRequest request)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is required.");
            }

            var success = await _service.UpdateUserAsync(userId, request.FirstName, request.LastName, request.UserName);

            if (success)
            {
                return Ok(new { message = "User updated successfully." });
            }

            return NotFound("User not found.");
        }

        [HttpGet("artikli_db")]
        public IActionResult GetAllArtiklsDB()
        {
            try
            {
                IEnumerable<object> artiklDb = _service.GetAllArtiklsDb();
                return Ok(artiklDb);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpGet("UkupnaStanjaView")]
        public async Task<IActionResult> GetUkupnaStanjaView()
        {
            try
            {
                var stanja = await _service.getUkupnaStanjaView();
                return Ok(stanja); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpGet("UkupnaArhiviranaStanjaView")]
        public async Task<IActionResult> GetUkupnaArhiviranaStanjaView()
        {
            try
            {
                var stanja = await _service.GetUkupnaArhiviranaStanjaViews();
                return Ok(stanja);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("primke-bez-lokacije")]
        public async Task<IActionResult> GetPrimkeBezLokacije()
        {
            try
            {
                var primke = await _service.GetPrimkeBezLokacijeAsync();
                return Ok(primke);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpGet("joined_artikls_db")]
        public IActionResult GetJoinedArtiklsData()
        {
            try
            {
                var joinedArtiklsData = _service.GetJoinedArtiklsData();
                return Ok(joinedArtiklsData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpGet("joined_artikls_db_by_id/{dokumentId}")]
        public IActionResult GetJoinedArtiklsDataById(int dokumentId)
        {
            try
            {
                var joinedArtiklsData = _service.GetJoinedArtiklsDataById(dokumentId);
                return Ok(joinedArtiklsData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpGet("joined_artikls_db_date_order")]
        public IActionResult GetJoinedDataDateOrder()
        {
            try
            {
                var joinedArtiklsData = _service.GetJoinedDataDateOrder();
                return Ok(joinedArtiklsData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("FIFO_list/{artiklId}")]
        public IActionResult GetFIFOlist(int artiklId)
        {
            try
            {
                var joinedArtiklsData = _service.GetFIFOlist(artiklId);
                return Ok(joinedArtiklsData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("izvrsi_fifo_izdatnica")]
        public async Task<IActionResult> ExecuteFifoIzdatnica([FromBody] FifoIzdatnicaRequest request)
        {
            if (request == null || request.DokumentId <= 0)
            {
                return BadRequest("Neispravan dokument ID.");
            }

            try
            {
                var result = await _service.ExecuteFifoForIzdatnicaAsync(request.DokumentId, request.ProcedureName);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Greška prilikom izvršavanja FIFO procedure: {ex.Message}");
            }
        }
        [HttpGet("ModalGraphInfo/{artiklId}")]
        public IActionResult GetModalGraphInfo(int artiklId)
        {
            try
            {
                var joinedArtiklsData = _service.GetModalGraphInfo(artiklId);
                return Ok(joinedArtiklsData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpPost("UpdateTrenutnaKolicina")]
        public async Task<IActionResult> UpdateTrenutnaKolicina()
        {
            // Read JSON data from the request body asynchronously
            using (var reader = new StreamReader(Request.Body))
            {
                var requestBody = await reader.ReadToEndAsync();
                dynamic data = JsonConvert.DeserializeObject(requestBody);

                // Extract values from the JSON
                int artiklId = data?.ArtiklId;
                int dokumentId = data?.DokumentId;
                int newKolicina = data?.NewKolicina;

                if (artiklId <= 0 || dokumentId <= 0 || newKolicina < 0)
                {
                    return BadRequest("Invalid request data.");
                }

                try
                {
                    bool success = await _service.UpdateTrenutnaKolicinaAsync(artiklId, dokumentId, newKolicina);

                    if (success)
                    {
                        return Ok("Trenutna količina je uspješno ažurirana.");
                    }
                    else
                    {
                        return NotFound("Artikl s ovim ID-om i DokumentID-om nije pronađen.");
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Internal server error");
                }
            }
        }

        [HttpPut("update_artikl/{id}")]
        public async Task<IActionResult> UpdateArtikl(int id, [FromBody] ArtiklUpdateModel model)
        {
            if (model == null)
            {
                return BadRequest("Artikl data is null.");
            }

            try
            {
                var result = await _service.UpdateArtiklAsync(id, model.ArtiklNaziv, model.ArtiklJmj, model.KategorijaId);

                if (result)
                {
                    return Ok("Artikl updated successfully.");
                }
                else
                {
                    return NotFound("Artikl not found.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("joined_dokument_tip")]
        public IActionResult GetJoinedDokumentTip()
        {
            try
            {
                var dokumenti = _service.GetJoinedDokumentTip();
                return Ok(dokumenti);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        //Dodavanje Artikla
        [HttpPost("add_artikl")]
        public async Task<IActionResult> AddArtikl([FromBody] Artikl artikl)
        {
            if (artikl == null)
            {
                return BadRequest("Artikl is null.");
            }

            try
            {
                bool result = await _service.AddArtiklAsync(artikl);
                if (result)
                {
                    return Ok("Artikl added successfully.");
                }
                else
                {
                    return StatusCode(500, "Internal server error while adding artikl.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpPost("mail_send")]
        public async Task<IActionResult> AddPrimka([FromBody] MailerDTO mDTO)
        {
            if (mDTO == null)
            {
                return BadRequest("Dokument je null.");
            }

            try
            {
                bool result = await _service.mailerAsync(mDTO);

                if (result)
                {
                    return Ok();
                }
                else
                {
                    return StatusCode(500, "Greška prilikom dodavanja dokumenta.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Greška: " + ex.Message);
            }
        }
        //Dodavanje novoga dokumenta(Nova primka ili izdatnica)  KORISTI SE I ZA NARUDZBENICE
        [HttpPost("add_dokument")]
        public async Task<IActionResult> AddDokument([FromBody] Dokument dokument)
        {
            if (dokument == null)
            {
                return BadRequest("Dokument je null.");
            }

            try
            {
                bool result = await _service.AddDokumentAsync(dokument);

                if (result)
                {
                    return Ok(new { dokumentId = dokument.DokumentId }); // ← VRAĆA PRAVI ID
                }
                else
                {
                    return StatusCode(500, "Greška prilikom dodavanja dokumenta.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Greška: " + ex.Message);
            }
        }

        [HttpPost("add_kategorija")]
        public async Task<IActionResult> AddKategorija([FromBody] Kategorija kat)
        {
            if (kat == null)
            {
                return BadRequest("Artikl is null.");
            }
            try
            {
                bool result = await _service.AddKategorijaAsync(kat);
                if (result)
                {
                    return Ok("Artikl added successfully.");
                }
                else
                {
                    return StatusCode(500, "Internal server error while adding artikl.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }


        //DODAVANJE ARTIKALADOKUMENTA
        [HttpPost("add_artDok")]
        public async Task<IActionResult> AddArtDok([FromBody] ArtikliDokumenata artDok)
        {
            if (artDok == null)
            {
                return BadRequest("Artikl is null.");
            }
            try
            {
                bool result = await _service.AddArtiklDokumenta(artDok);

                if (result)
                {
                    return Ok("Artikl added successfully.");
                }
                else
                {
                    return Conflict("Artikl je već dodan u narudžbenicu.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPut("update_artDok")]
        public async Task<IActionResult> UpdateArtiklDok([FromBody] ArtiklDokumentUpdateRequest request)
        {
            if (request == null)
                return BadRequest("Prazan zahtjev.");

            var result = await _service.UpdateArtiklDokumentaAsync(request.DokumentId, request.ArtiklId, request.Kolicina, request.Cijena);

            if (result)
                return Ok("ArtiklDokumenta updated.");

            return NotFound("ArtiklDokumenta nije pronađen.");
        }

        [HttpGet("artikli_dokumenta")]
        public async Task<IActionResult> GetAllArtikliDokumenata()
        {
            var data = await _service.GetAllArtikliDokumenataAsync();
            return Ok(data);
        }

        [HttpGet("artikli_dokumenta/{id}")]
        public async Task<IActionResult> GetArtikliDokumentaById(int id)
        {
            var item = await _service.GetArtikliDokumentaByIdAsync(id);
            if (item == null)
                return NotFound();

            return Ok(item);
        }


        //vracanje svih kategorija
        [HttpGet("kategorije")]
        public IActionResult GetAllKategorijeDB()
        {
            try
            {
                IEnumerable<Kategorija> kategorija = _service.GetAllKategorijeS();
                return Ok(kategorija);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpDelete("delete_artikl/{id}")]
        public async Task<IActionResult> DeleteArtikl(int id)
        {
            var result = await _service.DeleteArtiklAsync(id);

            if (result)
            {
                return NoContent(); // 204 No Content on successful delete
            }

            return NotFound(); // 404 Not Found if Artikl doesn't exist
        }

        [HttpGet("joined_narudzbenice")]
        public IActionResult GetJoinedNarudzbenice()
        {
            try
            {
                var narudzbenice = _service.GetJoinedNarudzbenice();
                return Ok(narudzbenice);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpGet("artikli_by_dokument/{dokumentId}")]
        public async Task<IActionResult> GetArtikliByDokumentId(int dokumentId)
        {
            var result = await _service.GetArtikliByDokumentIdAsync(dokumentId);
            return Ok(result);
        }


        [HttpPost("add_narudzbenica")]
        public async Task<IActionResult> AddNarudzbenica([FromBody] Dokument dokument)
        {
            if (dokument == null)
            {
                return BadRequest("Dokument je null.");
            }

            try
            {
                bool result = await _service.AddDokumentAsync(dokument);

                if (!result)
                    return StatusCode(500, "Greška prilikom dodavanja narudžbenice.");

                // ✅ Dodaj status samo za narudžbenice
                var status = new StatusDokumenta
                {
                    DokumentId = dokument.DokumentId,
                    StatusId = 1, // ← Zatvoren
                    Datum = DateTime.Now,
                    ZaposlenikId = dokument.ZaposlenikId, // uzmi iz istog dokumenta
                    aktivan = true
                };


                await _service.AddStatusDokumentaAsync(status);

                return Ok(new { dokumentId = dokument.DokumentId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Greška: " + ex.Message);
            }
        }

        [HttpGet("dobavljaciDTO")]
        public async Task<IActionResult> GetDobavljaciDTO()
        {
            var dobavljaci = await _service.GetAllDobavljaciAsync();

            var dtoList = dobavljaci.Select(d => new DobavljacDTO
            {
                DobavljacId = d.DobavljacId,
                DobavljacNaziv = d.DobavljacNaziv,
                AdresaDobavljaca = d.AdresaDobavljaca,
                BrojTelefona = d.brojTelefona,
                Email = d.Email
            }).ToList();

            return Ok(dtoList);
        }
        [HttpGet("dobavljaciDTO/{id}")]
        public async Task<IActionResult> GetDobavljacDTOById(int id)
        {
            var dobavljac = await _service.GetDobavljacByIdAsync(id);

            if (dobavljac == null)
                return NotFound();

            var dto = new DobavljacDTO
            {
                DobavljacId = dobavljac.DobavljacId,
                DobavljacNaziv = dobavljac.DobavljacNaziv,
                AdresaDobavljaca = dobavljac.AdresaDobavljaca,
                BrojTelefona = dobavljac.brojTelefona,
                Email = dobavljac.Email
            };

            return Ok(dto);
        }
        [HttpGet("dobavljaci")]
        public async Task<IActionResult> GetAllDobavljaci()
        {
            try
            {
                var dobavljaci = await _service.GetAllDobavljaciAsync();
                return Ok(dobavljaci);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Greška: " + ex.Message);
            }
        }
        [HttpGet("dobavljaci/{id}")]
        public async Task<IActionResult> GetDobavljacById(int id)
        {
            try
            {
                var dobavljac = await _service.GetDobavljacByIdAsync(id);
                if (dobavljac == null)
                    return NotFound("Dobavljač nije pronađen.");

                return Ok(dobavljac);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Greška: " + ex.Message);
            }
        }
        [HttpPost("add_dobavljaci")]
        public async Task<IActionResult> AddDobavljac([FromBody] Dobavljac dobavljac)
        {
            if (dobavljac == null)
                return BadRequest("Dobavljač je null.");

            var result = await _service.AddDobavljacAsync(dobavljac);
            if (!result)
                return StatusCode(500, "Greška prilikom dodavanja dobavljača.");

            return Ok(dobavljac); // ili samo dobavljac.DobavljacId
        }

        [HttpPut("update_dobavljac/{id}")]
        public async Task<IActionResult> UpdateDobavljac(int id, [FromBody] Dobavljac updatedDobavljac)
        {
            if (id != updatedDobavljac.DobavljacId)
                return BadRequest("ID dobavljača se ne podudara.");

            var result = await _service.UpdateDobavljacAsync(updatedDobavljac);

            if (result)
                return Ok("Dobavljač uspješno ažuriran.");

            return NotFound("Dobavljač nije pronađen.");
        }


        [HttpDelete("delete_dobavljac/{id}")]
        public async Task<IActionResult> DeleteDobavljac(int id)
        {
            var result = await _service.DeleteDobavljacAsync(id);

            if (result)
                return Ok("Dobavljač je uspješno obrisan.");

            return NotFound("Dobavljač nije pronađen.");
        }
        [HttpGet("dokumenti_by_dobavljac_status/{dobavljacId}")]
        public IActionResult getDokumentiByDobavljacStatus(int dobavljacId)
        {
            var data = _service.GetDokumentiByDostavljacStatus(dobavljacId);
            return Ok(data);
        }
        [HttpGet("dokumenti_by_dobavljac/{dobavljacId}")]
        public async Task<IActionResult> GetDokumentiByDobavljacId(int dobavljacId)
        {
            var dokumenti = await _service.GetDokumentiByDobavljacIdAsync(dobavljacId);

            var dtoList = dokumenti.Select(d => new DokumentDto
            {
                DokumentId = d.DokumentId,
                OznakaDokumenta = d.OznakaDokumenta,
                DatumDokumenta = d.DatumDokumenta,
                Napomena = d.Napomena,
                TipDokumenta = d.TipDokumenta?.TipDokumenta,
                DobavljacId = d.DobavljacId
            });

            return Ok(dtoList);
        }

        [HttpGet("skladiste")]
        public async Task<IActionResult> GetSkladiste()
        {
            var skl = await _service.GetSkladisteAsync();
            if (skl == null)
                return Ok(null);

            var dto = new SkladisteDTO
            {
                SkladisteId = skl.SkladisteId,
                SkladisteNaziv = skl.SkladisteNaziv,
                AdresaSkladista = skl.AdresaSkladista,
                BrojTelefona = skl.brojTelefona,
                Email = skl.Email
            };

            return Ok(dto);
        }

        [HttpPost("skladiste")]
        public async Task<IActionResult> AddSkladiste([FromBody] SkladistePodatci skladiste)
        {
            var result = await _service.AddSkladisteAsync(skladiste);
            if (!result)
                return StatusCode(500, "Greška prilikom dodavanja podataka.");

            return Ok(skladiste);
        }

        [HttpPut("skladiste/{id}")]
        public async Task<IActionResult> UpdateSkladiste(int id, [FromBody] SkladistePodatci skladiste)
        {
            if (id != skladiste.SkladisteId)
                return BadRequest("ID se ne podudara.");

            var result = await _service.UpdateSkladisteAsync(skladiste);

            if (result)
                return Ok("Skladište ažurirano.");

            return NotFound("Skladište nije pronađeno.");
        }

        [HttpDelete("obrisiDokument/{id}")]
        public async Task<IActionResult> ObrisiDokument(int id)
        {
            var statusId = await _service.GetAktivniStatusIdAsync(id);
            if (statusId == null)
                return NotFound();

            if (statusId != 1)
                return BadRequest("Dokument nije moguće obrisati jer nije otvoren.");

            var uspjeh = await _service.ObrisiDokumentAsync(id);
            if (!uspjeh)
                return NotFound();

            return NoContent();
        }


        [HttpPost("narudzbenica_detalji")]
        public async Task<IActionResult> KreirajNarudzbenicaDetalje([FromBody] NarudzbenicaDetaljiCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Neispravni podaci.");

            if (dto.RokIsporuke.Date < DateTime.Today)
                return BadRequest("Rok isporuke ne može biti u prošlosti.");

            var success = await _service.KreirajNarudzbenicaDetaljeAsync(dto);

            if (!success)
                return Conflict("NarudzbenicaDetalji već postoji za taj dokument.");

            return Ok("NarudzbenicaDetalji uspješno kreiran.");
        }
        [HttpGet("narudzbenica_detalji/{dokumentId}")]
        public async Task<IActionResult> GetNarudzbenicaDetalji(int dokumentId)
        {
            var detalji = await _service.DohvatiNarudzbenicaDetaljeAsync(dokumentId);

            if (detalji == null)
                return NotFound("Detalji narudžbenice nisu pronađeni.");

            return Ok(detalji);
        }
        [HttpGet("getDokument/{dokumentId}")]
        public async Task<IActionResult> getDokument(int dokumentId)
        {
            var detalji = await _service.getDokument(dokumentId);

            if (detalji == null)
                return NotFound("Detalji narudžbenice nisu pronađeni.");

            return Ok(detalji);
        }

        [HttpPut("narudzbenica_rok")]
        public async Task<IActionResult> UpdateNarudzbenicaRok([FromBody] NarudzbenicaRokUpdateDto dto)
        {
            if (dto.RokIsporuke.Date < DateTime.Today)
                return BadRequest("Rok isporuke ne može biti u prošlosti.");

            var statusId = await _service.GetAktivniStatusIdAsync(dto.DokumentId);
            if (statusId != 1)
                return BadRequest("Rok je moguće mijenjati samo za otvorene narudžbenice.");

            var ok = await _service.UpdateRokIsporukeAsync(dto.DokumentId, dto.RokIsporuke);
            if (!ok) return NotFound();
            return Ok();
        }
        [HttpGet("nacini_placanja")]
        public async Task<IActionResult> GetNaciniPlacanja()
        {
            var nacini = await _service.DohvatiSveNacinePlacanjaAsync();
            return Ok(nacini);
        }
        [HttpPost("dodaj_status_dokumenta")]
        public async Task<IActionResult> DodajStatusDokumenta([FromBody] StatusDokumenta status)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var uspjeh = await _service.DodajStatusDokumentaAsync(status);
            if (uspjeh)
                return Ok("Status dokumenta uspješno dodan.");
            else
                return StatusCode(500, "Došlo je do greške prilikom dodavanja statusa.");
        }
        [HttpPut("testMailer")]
        public async Task<IActionResult> TestMailer([FromBody] naruMailerDTO testDTO)
        {
            var result = await _service.TestMail(testDTO);
            if (!result)
                return NotFound("Status nije pronađen.");
            else return Ok();
        }

        [HttpPut("uredi_status_dokumenta")]
        public async Task<IActionResult> UrediStatus([FromBody] naruMailerDTO status)
        {
            var result = await _service.UrediStatusAsync(status);
            if (!result)
                return NotFound("Status nije pronađen.");

            return Ok("Status uspješno ažuriran.");
        }

        [HttpPut("zatvori_narudzbenicu")]
        public async Task<IActionResult> ZatvoriStatus([FromBody] StatusDokumenta status)
        {
            var result = await _service.ZatvoriStatusAsync(status);
            if (!result)
                return NotFound("Status nije pronađen.");

            return Ok("Status uspješno ažuriran.");
        }

        [HttpGet("statusi_tipovi")]
        public IActionResult GetStatusTipovi()
        {
            var tipovi = _service.GetAllStatusTipovi();
            return Ok(tipovi);
        }
        [HttpGet("statusi_dokumenata")]
        public IActionResult GetStatusiDokumenata()
        {
            var statusi = _service.GetAllStatusiDokumenata();
            return Ok(statusi);
        }
        [HttpPost("statusi_dokumenata")]
        public async Task<IActionResult> AddStatusDokumenta([FromBody] StatusDokumentaCreateRequest request)
        {
            if (request == null)
                return BadRequest("Prazan zahtjev.");

            var newStatus = new StatusDokumenta
            {
                DokumentId = request.DokumentId,
                StatusId = request.StatusId,
                Datum = request.Datum
            };

            var result = await _service.AddStatusDokumentaAsync(newStatus);

            if (result)
                return Ok("Status dodan.");
            else
                return StatusCode(500, "Greška prilikom dodavanja statusa.");
        }
        [HttpGet("statusi_dokumenata_by_dokument/{dokumentId}")]
        public IActionResult GetStatusiDokumentaByDokumentId(int dokumentId)
        {
            try
            {
                var statusi = _service.GetStatusiDokumentaByDokumentId(dokumentId);
                return Ok(statusi);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Greška: " + ex.Message);
            }
        }

        [HttpGet("dokument_status_parovi")]
        public async Task<ActionResult<List<DokumentStatusDto>>> GetDokumentStatusParovi()
        {
            var result = await _service.GetDokumentStatusPairsAsync();
            if (result == null || result.Count == 0)
            {
                return NotFound("Nema pronađenih statusa.");
            }

            return Ok(result);
        }
        [HttpPost("kreiraj_primnaru")]
        public async Task<IActionResult> KreirajPrimNaru([FromBody] PrimNaruVeze dto)
        {
            try
            {
                await _service.KreirajVezuAsync(dto.PrimkaId, dto.NarudzbenicaId);
                return Ok("Veza uspješno spremljena.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Greška: {ex.Message}");
            }
        }
        [HttpGet("primka_info/{id}")]
        public async Task<IActionResult> GetPrimkaInfo(int id)
        {
            var info = await _service.GetPrimkaInfoByIdAsync(id);
            if (info == null)
                return NotFound("Primka nije pronađena.");
            return Ok(info);
        }
        [HttpGet("izdatnica_info/{id}")]
        public async Task<IActionResult> GetIzdatnicaInfo(int id)
        {
            var info = await _service.GetIzdatnicaInfoByIdAsync(id);
            if (info == null)
                return NotFound("Izdatnica nije pronađena.");
            return Ok(info);
        }
        [HttpGet("artikli_info_po_primci/{primkaId}")]
        public async Task<IActionResult> GetArtikliInfoByPrimkaId(int primkaId)
        {
            var result = await _service.GetArtikliInfoByPrimkaId(primkaId);
            return Ok(result);
        }

        [HttpPost("azuriraj_narudzbenica_kolicine")]
        public async Task<IActionResult> AzurirajNarudzbenicaKolicine([FromBody] PrimNaruVezeDto dto)
        {
            var result = await _service.AzurirajNarudzbenicaKolicineAsync(dto.NarudzbenicaId, dto.PrimkaId);
            if (result)
                return Ok("Kolicine azurirane.");

            return StatusCode(500, "Greska kod azuriranja kolicina.");
        }

        [HttpGet("monthly_stats")]
        public IActionResult GetMonthlyStats()
        {
            var data = _service.GetMonthlyStats();
            return Ok(data);
        }

        [HttpGet("monthly_stats/{artiklId}")]
        public IActionResult GetMonthlyStatsForArtikl(int artiklId)
        {
            var data = _service.GetMonthlyStatsForArtikl(artiklId);
            return Ok(data);
        }

        [HttpGet("daily_stats_last30")]
        public IActionResult GetDailyStatsLast30Days()
        {
            var data = _service.GetDailyStatsLast30Days();
            return Ok(data);
        }

        [HttpGet("daily_stats/{year}/{month}")]
        public IActionResult GetDailyStatsForMonth(int year, int month)
        {
            var data = _service.GetDailyStatsForMonth(year, month);
            return Ok(data);
        }

        [HttpGet("most_sold_products")]
        public IActionResult GetMostSoldProducts()
        {
            var data = _service.GetMostSoldProducts();
            return Ok(data);
        }

        [HttpGet("average_storage_time")]
        public IActionResult GetAverageStorageTime()
        {
            var data = _service.GetAverageStorageTimes();
            return Ok(data);
        }

        [HttpGet("get_all_otpis")]
        public IActionResult GetAllOtpis()
        {
            var data = _service.GetAllOtpis();
            return Ok(data);
        }
        [HttpGet ("get_all_otpis_joined")]
        public async Task<IActionResult> GetAllOtpisJoined()
        {
            var stavke = await _service.GetAllOtpisJoined();
            return Ok(stavke);
        }
        [HttpGet("otpis_info/{id}")]
        public async Task<IActionResult> GetOtpisInfoById(int id)
        {
            var info = await _service.GetOtpisByIdAsync(id);
            if (info == null)
                return NotFound("Otpis nije pronađen.");
            return Ok(info);
        }

        [HttpPost("add_arhiva")]
        public async Task<IActionResult> AddArhiva([FromBody] Arhive arhiva)
        {
            if (arhiva == null)
            {
                return BadRequest("Arhiva je null.");
            }

            try
            {
                bool result = await _service.AddArhivaAsync(arhiva);

                if (result)
                {
                    return Ok(new { arhivaId = arhiva.ArhivaId }); // ← VRAĆA PRAVI ID
                }
                else
                {
                    return StatusCode(500, "Greška prilikom dodavanja dokumenta.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Greška: " + ex.Message);
            }

        }

        [HttpPost("add_arhiva_stanje")]
        public async Task<IActionResult> AddArhivaStanje([FromBody] ArhiveStanja arhiveStanja)
        {
            if (arhiveStanja == null)
            {
                return BadRequest("Arhiva je null.");
            }

            try
            { 
                bool result = await _service.AddArhivaStanjeAsync(arhiveStanja);

                if (result)
                {
                    return Ok(new { zapisArhiveStanjaId = arhiveStanja.ZapisArhiveStanjaId }); // ← VRAĆA PRAVI ID
                }
                else
                {
                    return StatusCode(500, "Greška prilikom dodavanja dokumenta.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Greška: " + ex.Message);
            }

        }
       
        [HttpGet("get_all_arhive")]
        public IActionResult GetAllArhive()
        {
            var data = _service.GetAllArhive();
            return Ok(data);
        }
        [HttpGet("arhive/{id}")]
        public async Task<IActionResult> GetArhiveById(int id)
        {
            var info = await _service.GetArhiveByIdAsync(id);
            if (info == null)
                return NotFound("Arhiva nije pronađena.");
            return Ok(info);
        }

        [HttpPost("arhiviraj-dokumente")]
        public async Task<IActionResult> ArhivirajDokumente([FromBody] SParhivirajDokumentePoDatumuDTO request)
        {
            if (request == null)
                return BadRequest("Podaci nisu poslani.");

            var rezultat = await _service.ArhivirajDokumenteByDatumAsync(request);

            if (rezultat)
                return Ok("Dokumenti su uspješno arhivirani.");
            else
                return StatusCode(500, "Dogodila se greška prilikom arhiviranja.");
        }

        [HttpGet("GetDokumentiByArhivaId/{arhivaId}")]
        public async Task<ActionResult<List<DokumentByArhivaId>>> GetDokumentiByArhivaId(int arhivaId)
        {
            var dokumenti = await _service.GetDokumentiByArhivaIdAsync(arhivaId);

            if (dokumenti == null || dokumenti.Count == 0)
                return NotFound($"Nema dokumenata za arhivu ID: {arhivaId}");

            return Ok(dokumenti);
        }
        [HttpGet("GetStanjaByArhivaId/{arhivaId}")]
        public async Task<ActionResult<List<DokumentByArhivaId>>> GetStanjaByArhivaId(int arhivaId)
        {
            var artikli = await _service.GetStanjaByArhivaId(arhivaId);

            if (artikli == null || artikli.Count == 0)
                return NotFound($"Nema artikala za arhivu ID: {arhivaId}");

            return Ok(artikli);
        }
        [HttpPost("add_skladiste_lokacija")]
        public async Task<IActionResult> AddSkladisteLokacija([FromBody] SkladisteLokacija sl)
        {
            if (sl == null)
            {
                return BadRequest("Arhiva je null.");
            }

            try
            {
                bool result = await _service.AddSkladisteLokacija(sl);

                if (result)
                {
                    return Ok(new { LOK_ID = sl.LOK_ID }); // ← VRAĆA PRAVI ID
                }
                else
                {
                    return StatusCode(500, "Greška prilikom dodavanja dokumenta.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Greška: " + ex.Message);
            }

        }
        [HttpGet("get_all_skladiste_lokacija")] //TODO TREBA ICI PREKO SKLADISTE ID - VRACATI SVE PREKO SLKADISTE ID
        public async Task<IActionResult> GetAllSkladisteLokacija()
        {
            var stavke = await _service.GetAllSkladisteLokacija();
            return Ok(stavke);
        }
        [HttpDelete("delete_skladiste_lokacija/{id}")]
        public async Task<IActionResult> DeleteSkladisteLokcija(int id)
        {
            var result = await _service.DeleteSkladisteLokacija(id);

            if (result)
            {
                return NoContent(); 
            }

            return NotFound(); 
        }
        [HttpPut("update_skladiste_lokacija/{id}")]
        public async Task<IActionResult> UpdateSkladisteLokacija(int id, [FromBody] SkladisteLokacija sl)
        {
            if (id != sl.LOK_ID)
                return BadRequest(new { message = "ID lokacije se ne podudara." });

            var result = await _service.UpdateSkladisteLokacija(sl);
            if (result)
                return Ok(new { message = "Lokacija uspješno ažurirana." });
            else
                return NotFound(new { message = "Lokacija nije pronađena." });
        }
        [HttpGet("get_all_lokacije_artikala")]
        public async Task<IActionResult> GetAllLokacijeArtikala()
        {
            var result = await _service.GetAllLokacijeArtikala();
            return Ok(result);
        }

        [HttpGet("get_lokacija_artikla/{artDokId}")]
        public async Task<IActionResult> GetLokacijaArtiklaById(int artDokId)
        {
            var result = await _service.GetLokacijaArtiklaById(artDokId);
            if (result == null)
                return NotFound(new { message = "Lokacija artikla nije pronađena." });

            return Ok(result);
        }

        [HttpPost("add_lokacija_artikla")]
        public async Task<IActionResult> AddLokacijaArtikla([FromBody] LokacijeArtikala la)
        {
            var result = await _service.AddLokacijaArtikla(la);
            if (result)
                return Ok(new { message = "Lokacija artikla uspješno dodana." });
            else
                return BadRequest(new { message = "Greška prilikom dodavanja lokacije artikla." });
        }

        [HttpPut("update_lokacija_artikla")]
        public async Task<IActionResult> UpdateLokacijaArtikla( [FromBody] LokacijeArtikala la)
        {
           
            var result = await _service.UpdateLokacijaArtikla(la);
            if (result)
                return Ok(new { message = "Lokacija artikla uspješno ažurirana." });
            else
                return NotFound(new { message = "Lokacija artikla nije pronađena." + la });
        }

        [HttpDelete("delete_lokacija_artikla/{id}")]
        public async Task<IActionResult> DeleteLokacijaArtikla(int id)
        {
            var result = await _service.DeleteLokacijaArtikla(id);
            if (result)
                return Ok(new { message = "Lokacija artikla uspješno obrisana." });
            else
                return NotFound(new { message = "Lokacija artikla nije pronađena." });
        }

    }



    public class ArtiklUpdateModel
    {
        public string ArtiklNaziv { get; set; }
        public string ArtiklJmj { get; set; }
        public int KategorijaId { get; set; }
    }
    public class UpdateUserRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
    }

    public class ArtiklDokumentUpdateRequest
    {
        public int DokumentId { get; set; }
        public int ArtiklId { get; set; }
        public float Kolicina { get; set; }
        public float Cijena { get; set; }
    }

}
