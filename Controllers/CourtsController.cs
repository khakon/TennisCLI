using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TennisCLI.Models;

namespace TennisCLI.Controllers
{
  [Route("api/courts")]
  public class CourtsController : Controller
  {
    private long start = 1483401600000;
    private int year = 2017;
    private int month = 10;
    private int timeKoeff = 3600000;
    private TennisDbContext db;
    public CourtsController(TennisDbContext tennisContext)
    {
      db = tennisContext;
    }
    public IActionResult GetAll(int month = 0) //
    {
      if (month == 0) month = DateTime.Now.Month;
      return Ok(new
      {
        model = db.Courts,
        apiStatus = "successfully_retrieved_products",
        message = "Successfully able to retrieve products",
        success = true
      });
    }

    [HttpGet("GetByMonth/{month}")]
    public IActionResult GetAllByMonth(int month = 0) //
    {
      if (month == 0) month = DateTime.Now.Month;
      try
      {
        var reservs = db.Reservations.Where(s => s.Year == year && s.Month == month);
        var result = db.Courts.Select(s => new
        {
          s.Id,
          s.Name,
          CountCustomers = db.SubscribePlayers.Where(t => reservs.Where(r => r.CourtId == s.Id).Any(r => r.Id == t.ReservationId)).Select(p => p.PlayerId).Distinct().Count(),
          CountTreners = db.SubscribeTreners.Where(t => reservs.Where(r => r.CourtId == s.Id).Any(r => r.Id == t.ReservationId)).Select(p => p.TrenerId).Distinct().Count(),
          CountHoursRes = reservs.Where(r => r.CourtId == s.Id).Sum(r => r.Range/ timeKoeff) ,
          CountHoursOrd = reservs.Where(r => r.CourtId == s.Id && db.SubscribePlayers.Where(p => p.Order).Any(p => p.ReservationId == r.Id)).Sum(r => r.Range / timeKoeff) ,
          SumOrd = reservs.Where(r => r.CourtId == s.Id && db.SubscribePlayers.Where(p => p.Order).Any(p => p.ReservationId == r.Id)).Sum(r => r.Total)
        });
        return Ok(new
        {
          model = result,
          apiStatus = "successfully_retrieved_products",
          message = "Successfully able to retrieve products",
          success = true
        });
      }
      catch (Exception ex)
      {
        return Ok(new { apiStatus = "internal_error_deleted", message = ex.Message, success = false });
      }
    }
    [HttpGet("GetById/{id}")]
    public IActionResult Get(int id)
    {
      return Ok(new { model = db.Courts.FirstOrDefault(s => s.Id == id), apiStatus = "successfully", message = "Successfully able to retrieve courts", success = true });
    }
    [HttpPost]
    [Produces("application/json")]
    public IActionResult Add([FromBody]Court model)
    {
      try
      {
        if (db.Courts.Any(s => s.Id == model.Id))
        {
          var item = db.Courts.FirstOrDefault(s => s.Id == model.Id);
          item.Name = model.Name;
          item.Adress = model.Adress;
          item.Description = model.Description;
          //item.Image = model.Image;
          item.Rating = model.Rating;
          item.RegionId = model.RegionId;
          db.Update(item);
          db.SaveChanges();
          return Ok(new { model = db.Courts.Select(s => new
          {
            s.Id,
            s.Name,
            CountCustomers = 0,
            CountTreners = 0,
            CountHoursRes = 0,
            CountHoursOrd = 0,
            SumOrd = 0,
            SumPay = 0,
            SumRes = 0
          }), apiStatus = "successfully_updated", message = "Successfully updated the court", success = true });
        }
        model.Image = "images/3.jpg";
        db.Add(model);
        db.SaveChanges();
        return Ok(new { model = db.Courts.Select(s => new
        {
          s.Id,
          s.Name,
          CountCustomers = 0,
          CountTreners = 0,
          CountHoursRes = 0,
          CountHoursOrd = 0,
          SumOrd = 0,
          SumPay = 0,
          SumRes = 0
        }), apiStatus = "successfully_added", message = "Successfully added the court", success = true });
      }
      catch (Exception ex)
      {
        return Ok(new { apiStatus = "internal_error_added", message = ex.Message, success = false });
      }
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int Id)
    {
      try
      {
        if (!db.Courts.Any(s => s.Id == Id)) return Ok(new { model = db.Courts, apiStatus = "error_deleted", message = Id.ToString() + " Error, court don't found", success = false });
        var item = db.Courts.FirstOrDefault(s => s.Id == Id);
        db.Remove(item);
        db.SaveChanges();
        return Ok(new { model = db.Courts, apiStatus = "successfully_deleted", message = "Successfully deleted the court", success = true });
      }
      catch (Exception ex)
      {
        return Ok(new { apiStatus = "internal_error_deleted", message = ex.Message, success = false });
      }
    }
  }
}