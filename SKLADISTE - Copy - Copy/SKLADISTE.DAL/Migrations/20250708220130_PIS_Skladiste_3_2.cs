using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class PIS_Skladiste_3_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dokumenti_Skladista_SkladisteId",
                table: "Dokumenti");

            migrationBuilder.DropTable(
                name: "Skladista");

            migrationBuilder.DropIndex(
                name: "IX_Dokumenti_SkladisteId",
                table: "Dokumenti");

            migrationBuilder.DropColumn(
                name: "SkladisteId",
                table: "Dokumenti");

            migrationBuilder.CreateTable(
                name: "SkladistePodatcis",
                columns: table => new
                {
                    SkladisteId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SkladisteNaziv = table.Column<string>(nullable: true),
                    AdresaSkladista = table.Column<string>(nullable: true),
                    brojTelefona = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkladistePodatcis", x => x.SkladisteId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SkladistePodatcis");

            migrationBuilder.AddColumn<int>(
                name: "SkladisteId",
                table: "Dokumenti",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Skladista",
                columns: table => new
                {
                    SkladisteId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdresaSkladista = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SkladisteNaziv = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    brojTelefona = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Skladista", x => x.SkladisteId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Dokumenti_SkladisteId",
                table: "Dokumenti",
                column: "SkladisteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Dokumenti_Skladista_SkladisteId",
                table: "Dokumenti",
                column: "SkladisteId",
                principalTable: "Skladista",
                principalColumn: "SkladisteId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
