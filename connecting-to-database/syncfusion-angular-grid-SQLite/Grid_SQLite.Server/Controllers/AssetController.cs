using Grid_SQLite.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Syncfusion.EJ2.Base;

namespace Grid_SQLite.Server.Controllers
{
    [Route("api/[controller]")]
    public class AssetController : ControllerBase
    {
        private readonly AssetDbContext _db;

        public AssetController(AssetDbContext db)
        {
            _db = db;
        }

        // READ
        [HttpPost("url")]
        public IActionResult UrlDataSource([FromBody] DataManagerRequest dm)
        {
            IQueryable<Asset> query = _db.Assets.AsNoTracking();
            var op = new DataOperations();

            if (dm.Search?.Count > 0)
                query = op.PerformSearching(query, dm.Search).Cast<Asset>().AsQueryable();

            if (dm.Where?.Count > 0)
                query = op.PerformFiltering(query, dm.Where, dm.Where[0].Operator)
                    .Cast<Asset>()
                    .AsQueryable();

            if (dm.Sorted?.Count > 0)
                query = op.PerformSorting(query, dm.Sorted).Cast<Asset>().AsQueryable();
            else
                query = query.OrderBy(a => a.Id);

            var count = query.Count();

            if (dm.Skip > 0)
                query = query.Skip(dm.Skip);

            if (dm.Take > 0)
                query = query.Take(dm.Take);

            return dm.RequiresCounts
                ? Ok(new { result = query.ToList(), count })
                : Ok(query.ToList());
        }

        // CREATE
        [HttpPost("insert")]
        public IActionResult Insert([FromBody] CRUDModel<Asset> value)
        {
            var asset = value.Value;

            // Identity handled automatically
            asset.Id = 0;

            _db.Assets.Add(asset);
            _db.SaveChanges();

            return Ok(asset);
        }

        // UPDATE
        [HttpPost("update")]
        public IActionResult Update([FromBody] CRUDModel<Asset> value)
        {
            var asset = value.Value;

            _db.Entry(asset).State = EntityState.Modified;
            _db.SaveChanges();

            return Ok(asset);
        }

        // DELETE
        [HttpPost("remove")]
        public IActionResult Remove([FromBody] CRUDModel<Asset> value)
        {
            int key;
            if (value.Key is System.Text.Json.JsonElement jsonElement)
            {
                key = jsonElement.GetInt32();
            }
            else
            {
                key = Convert.ToInt32(value.Key);
            }
            var asset = _db.Assets.First(a => a.Id == key);

            _db.Assets.Remove(asset);
            _db.SaveChanges();

            return Ok(value);
        }

        // BATCH
        [HttpPost("batch")]
        public IActionResult Batch([FromBody] CRUDModel<Asset> value)
        {
            if (value.Changed != null)
            {
                foreach (var asset in value.Changed)
                {
                    _db.Assets.Attach(asset);
                    _db.Entry(asset).State = EntityState.Modified;
                }
            }

            if (value.Added != null)
            {
                foreach (var asset in value.Added)
                {
                    asset.Id = 0;
                    _db.Assets.Add(asset);
                }
            }

            if (value.Deleted != null)
            {
                foreach (var asset in value.Deleted)
                {
                    var existing = _db.Assets.Find(asset.Id);
                    if (existing != null)
                        _db.Assets.Remove(existing);
                }
            }

            _db.SaveChanges();
            return Ok(value);
        }
    }
}
