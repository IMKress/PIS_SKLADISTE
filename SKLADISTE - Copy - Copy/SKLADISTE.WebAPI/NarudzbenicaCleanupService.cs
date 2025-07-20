using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using SKLADISTE.Service.Common;

namespace SKLADISTE.WebAPI
{
    public class NarudzbenicaCleanupService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<NarudzbenicaCleanupService> _logger;
        private readonly TimeSpan _interval = TimeSpan.FromHours(1);

        public NarudzbenicaCleanupService(IServiceScopeFactory scopeFactory, ILogger<NarudzbenicaCleanupService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var service = scope.ServiceProvider.GetRequiredService<IService>();
                    var removed = await service.ObrisiStareOtvoreneNarudzbeniceAsync();
                    if (removed > 0)
                    {
                        _logger.LogInformation($"Automatski obrisano {removed} narudžbenica.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Greška prilikom automatskog brisanja narudžbenica");
                }

                await Task.Delay(_interval, stoppingToken);
            }
        }
    }
}
