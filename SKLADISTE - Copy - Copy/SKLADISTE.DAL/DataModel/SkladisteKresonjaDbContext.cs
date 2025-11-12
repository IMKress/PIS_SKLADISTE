using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace SKLADISTE.DAL.DataModel
{
    public class SkladisteKresonjaDbContext : IdentityDbContext<ApplicationUser>
    {
        public SkladisteKresonjaDbContext(DbContextOptions<SkladisteKresonjaDbContext> options)
            : base(options) { }

        public DbSet<Kategorija> Kategorije { get; set; }
        public DbSet<Dokument> Dokumenti { get; set; }
        public DbSet<Artikl> Artikli { get; set; }
        public DbSet<ArtikliDokumenata> ArtikliDokumenata { get; set; }
        public DbSet<DokumentTip> DokumentTipovi { get; set; }
        public DbSet<StatusDokumenta> StatusiDokumenata { get; set; }
        public DbSet<StatusTip> StatusiTipova { get; set; }
        public DbSet<Dobavljac> Dobavljaci { get; set; }
        public DbSet<SkladistePodatci> SkladistePodatcis { get; set; }
        public DbSet<PrimNaruVeze> PrimNaruVeze { get; set; }
        public DbSet<Nacin_Placanja> NaciniPlacanja { get; set; }
        public DbSet<NarudzbenicaDetalji> NarudzbenicaDetalji { get; set; }
        public DbSet<UkupnaStanjaView> UkupnaStanjaViews { get; set; }
        public DbSet<UkupnaArhiviranaStanjaView> UkupnaArhiviranaStanjaViews { get; set; }
        public DbSet<DokumentByArhivaId> DokumentByArhivaId { get; set; }
        public DbSet<GetStanjaByArhivaId> GetStanjaByArhivaId { get; set; }
        public DbSet<SkladisteLokacija> SkladisteLokacija { get; set; }
        public DbSet<LokacijeArtikala> LokacijeArtikala { get; set; }
        public DbSet<ViewJoinedOtpis> ViewJoinedOtpis { get; set; }
        public DbSet<ViewPrimkeBezLokacije> ViewPrimkeBezLokacije { get; set; }
        public DbSet<Arhive> Arhive { get; set; }
        public DbSet<ArhiveStanja> ArhiveStanja { get; set; }
        public DbSet<ArhiveDokumenti> ArhiveDokumenti { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // -------- SkladistePodatci
            modelBuilder.Entity<SkladistePodatci>()
                .HasKey(s => s.SkladisteId);

            // -------- SkladisteLokacija (FK -> SkladistePodatci)
            modelBuilder.Entity<SkladisteLokacija>()
                .HasKey(k => k.LOK_ID);

            modelBuilder.Entity<SkladisteLokacija>()
                .HasOne(sl => sl.Skladiste)
                .WithMany(s => s.Lokacije)
                .HasForeignKey(sl => sl.skladiste_id)
                .HasPrincipalKey(s => s.SkladisteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SkladisteLokacija>()
                .HasIndex(sl => sl.skladiste_id);

            // -------- LokacijeArtikala
            modelBuilder.Entity<LokacijeArtikala>(entity =>
            {
                entity.HasKey(e => e.LOK_ART_ID);

                entity.HasOne(e => e.Lokacija)
                      .WithMany(l => l.LokacijeArtikala)
                      .HasForeignKey(e => e.LOK_ID)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.ArtikliDokument)
                      .WithMany(a => a.LokacijeArtikala)
                      .HasForeignKey(e => e.ART_DOK_ID)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // -------- Arhive / ArhiveStanja
            modelBuilder.Entity<Arhive>()
                .HasKey(a => a.ArhivaId);

            modelBuilder.Entity<ArhiveStanja>()
                .HasKey(x => x.ZapisArhiveStanjaId);

            modelBuilder.Entity<ArhiveStanja>()
                .HasOne<Arhive>()
                .WithMany()
                .HasForeignKey(x => x.ArhivaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ArhiveStanja>()
                .HasOne<Artikl>()
                .WithMany()
                .HasForeignKey(x => x.ArtiklId)
                .OnDelete(DeleteBehavior.Cascade);

            // -------- ArhiveDokumenti (FK -> Arhive, Dokumenti)
            modelBuilder.Entity<ArhiveDokumenti>()
                .HasKey(x => x.ZapisArhivieDokumentaId);

            modelBuilder.Entity<ArhiveDokumenti>()
                .HasOne(ad => ad.Arhiva)
                .WithMany(a => a.ArhiveDokumenti)
                .HasForeignKey(ad => ad.ArhivaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ArhiveDokumenti>()
                .HasOne(ad => ad.Dokument)
                .WithMany(d => d.ArhiveDokumenti)   // osiguraj da Dokument ima ICollection<ArhiveDokumenti> ArhiveDokumenti { get; set; }
                .HasForeignKey(ad => ad.DokumentId)
                .OnDelete(DeleteBehavior.Restrict);

            // -------- Pogledi / View-ovi
            modelBuilder.Entity<ViewJoinedOtpis>()
                .HasNoKey()
                .ToView("ViewJoinedOtpis");

            modelBuilder.Entity<UkupnaStanjaView>()
                .HasNoKey()
                .ToView("UkupnaStanjaView");

            modelBuilder.Entity<UkupnaArhiviranaStanjaView>()
                .HasNoKey()
                .ToView("UkupnaArhiviranaStanjaView");

            modelBuilder.Entity<ViewPrimkeBezLokacije>()
                .HasNoKey()
                .ToView("ViewPrimkeBezLokacije");

            modelBuilder.Entity<DokumentByArhivaId>()
                .HasNoKey();

            modelBuilder.Entity<GetStanjaByArhivaId>(entity =>
            {
                entity.HasNoKey();
                entity.ToView(null); // TVF/Stored proc rezultat bez fizičkog view-a
            });

            // -------- Kategorije / Artikli
            modelBuilder.Entity<Kategorija>()
                .HasKey(k => k.KategorijaId);

            modelBuilder.Entity<Artikl>()
                .HasKey(a => a.ArtiklId);

            modelBuilder.Entity<Artikl>()
                .HasOne(a => a.Kategorija)
                .WithMany()
                .HasForeignKey(a => a.KategorijaId)
                .OnDelete(DeleteBehavior.Cascade);

            // -------- DokumentTip
            modelBuilder.Entity<DokumentTip>()
                .HasKey(dt => dt.TipDokumentaId);

            modelBuilder.Entity<DokumentTip>()
                .Property(dt => dt.TipDokumenta)
                .IsRequired();

            // -------- Dokument
            modelBuilder.Entity<Dokument>()
                .HasKey(d => d.DokumentId);

            modelBuilder.Entity<Dokument>()
                .Property(d => d.DokumentId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Dokument>()
                .Property(d => d.Napomena)
                .HasMaxLength(500);

            modelBuilder.Entity<Dokument>()
                .Property(d => d.DobavljacId)
                .IsRequired(false);

            modelBuilder.Entity<Dokument>()
                .HasOne(d => d.TipDokumenta)
                .WithMany(dt => dt.Dokumenti)
                .HasForeignKey(d => d.TipDokumentaId)
                .OnDelete(DeleteBehavior.Cascade);

            // -------- ArtikliDokumenata
            modelBuilder.Entity<ArtikliDokumenata>()
                .HasKey(ad => ad.Id);

            modelBuilder.Entity<ArtikliDokumenata>()
                .HasOne(ad => ad.Dokument)
                .WithMany(d => d.ArtikliDokumenata)
                .HasForeignKey(ad => ad.DokumentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ArtikliDokumenata>()
                .HasOne(ad => ad.Artikl)
                .WithMany()
                .HasForeignKey(ad => ad.ArtiklId)
                .OnDelete(DeleteBehavior.Cascade);

            // -------- StatusTip / StatusDokumenta
            modelBuilder.Entity<StatusTip>()
                .HasKey(st => st.StatusId);

            modelBuilder.Entity<StatusTip>()
                .Property(st => st.StatusNaziv)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<StatusDokumenta>()
                .HasKey(sd => new { sd.DokumentId, sd.StatusId });

            modelBuilder.Entity<StatusDokumenta>()
                .HasOne(sd => sd.Dokument)
                .WithMany(d => d.StatusDokumenta)
                .HasForeignKey(sd => sd.DokumentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StatusDokumenta>()
                .HasOne(sd => sd.StatusTip)
                .WithMany(st => st.StatusiDokumenata)
                .HasForeignKey(sd => sd.StatusId)
                .OnDelete(DeleteBehavior.Cascade);

            // -------- PrimNaruVeze
            modelBuilder.Entity<PrimNaruVeze>()
                .HasKey(p => p.PmvId);

            modelBuilder.Entity<PrimNaruVeze>()
                .HasOne(p => p.Primka)
                .WithMany(d => d.PrimkeVeze)
                .HasForeignKey(p => p.PrimkaId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PrimNaruVeze>()
                .HasOne(p => p.Narudzbenica)
                .WithMany(d => d.NarudzbeniceVeze)
                .HasForeignKey(p => p.NarudzbenicaId)
                .OnDelete(DeleteBehavior.Cascade);

            // -------- Nacin Placanja / NarudzbenicaDetalji
            modelBuilder.Entity<Nacin_Placanja>()
                .HasKey(n => n.NP_Id);

            modelBuilder.Entity<Nacin_Placanja>()
                .Property(n => n.NP_Naziv)
                .IsRequired(false);

            modelBuilder.Entity<NarudzbenicaDetalji>()
                .HasKey(d => d.DokumentId);

            modelBuilder.Entity<NarudzbenicaDetalji>()
                .HasOne(n => n.NacinPlacanja)
                .WithMany(p => p.Narudzbenice)
                .HasForeignKey(n => n.NP_Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<NarudzbenicaDetalji>()
                .HasOne<Dokument>()
                .WithOne()
                .HasForeignKey<NarudzbenicaDetalji>(d => d.DokumentId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
