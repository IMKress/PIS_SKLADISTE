using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class PIS_5_5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ArhiveDokumenti",
                columns: table => new
                {
                    ZapisArhivieDokumentaId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ArhivaId = table.Column<int>(nullable: false),
                    DokumentId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArhiveDokumenti", x => x.ZapisArhivieDokumentaId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ArhiveDokumenti");
        }
    }
}
