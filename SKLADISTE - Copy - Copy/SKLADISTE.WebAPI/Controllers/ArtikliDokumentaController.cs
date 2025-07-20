using Microsoft.AspNetCore.Mvc;
using SKLADISTE.Service.Common;
using SKLADISTE.DAL.DataModel;
using System;
using System.Threading.Tasks;

namespace SKLADISTE.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArtikliDokumentaController : ControllerBase
    {
        private readonly IService _service;

        public ArtikliDokumentaController(IService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllArtikliDokumenataAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _service.GetArtikliDokumentaByIdAsync(id);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ArtikliDokumenata model)
        {
            if (model == null)
                return BadRequest();

            var success = await _service.AddArtiklDokumenta(model);
            if (success)
                return Ok("ArtiklDokumenta created.");
            else
                return StatusCode(500, "Internal server error while adding.");
        }
    }
}
