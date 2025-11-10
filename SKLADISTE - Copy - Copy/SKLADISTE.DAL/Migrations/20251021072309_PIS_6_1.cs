using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class PIS_6_1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DokumentByArhivaId",
                columns: table => new
                {
                    DokumentId = table.Column<int>(nullable: false),
                    DatumDokumenta = table.Column<DateTime>(nullable: false),
                    OznakaDokumenta = table.Column<string>(nullable: true),
                    ZaposlenikId = table.Column<string>(nullable: true),
                    ArhivaId = table.Column<int>(nullable: false),
                    TipDokumenta = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "SkladisteLokacija",
                columns: table => new
                {
                    LOK_ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    POLICA = table.Column<string>(nullable: true),
                    BR_RED = table.Column<int>(nullable: false),
                    BR_STUP = table.Column<int>(nullable: false),
                    NEMA_MJESTA = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkladisteLokacija", x => x.LOK_ID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DokumentByArhivaId");

            migrationBuilder.DropTable(
                name: "SkladisteLokacija");
        }
    }
}
