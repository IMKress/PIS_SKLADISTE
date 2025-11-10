using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class PIS_6_4_dodavanje_triggera : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
            CREATE TRIGGER trg_ValidateLokacijeArtikala
            ON LokacijeArtikala
            INSTEAD OF INSERT, UPDATE
            AS
            BEGIN
                SET NOCOUNT ON;

                IF EXISTS (
                    SELECT 1
                    FROM inserted i
                    JOIN SkladisteLokacija l ON i.LOK_ID = l.LOK_ID
                    WHERE i.red > l.BR_RED OR i.stupac > l.BR_STUP
                )
                BEGIN
                    RAISERROR ('Red ili stupac veći od maksimalnog broja u lokaciji.', 16, 1);
                    ROLLBACK TRANSACTION;
                    RETURN;
                END;

                INSERT INTO LokacijeArtikala (LOK_ID, ART_DOK_ID, red, stupac)
                SELECT LOK_ID, ART_DOK_ID, red, stupac FROM inserted;
            END;
        ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TRIGGER IF EXISTS trg_ValidateLokacijeArtikala;");
        }
    }
}
