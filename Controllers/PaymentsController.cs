using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TennisCLI.Models;

namespace TennisCLI.Controllers
{
  [Route("api/pays")]
  public class PaymentsController : Controller
  {
    private long start = 1504224000000;
    private int year = 2017;
    private int month = 10;
    private TennisDbContext db;
    public PaymentsController(TennisDbContext tennisContext)
    {
      db = tennisContext;
    }
    public IActionResult Index()
    {
      return View();
    }
    [HttpGet("GetByMonth/{month}")]
    public IActionResult GetByMonth(int month = 0)
    {
      if (month == 0) month = DateTime.Now.Month;
      var pays = db.Payments.Where(s => s.Month == month && s.Year == year);
      var result = pays.Select(s => new
      {
        s.Id,
        s.Date,
        s.PlayerId,
        Player = s.Player.Name,
        s.TrenerId,
        Trener = s.Trener.Name,
        s.Total
      }).OrderBy(s => s.Date).ThenBy(s => s.Player);
      return Ok(new
      {
        model = result,
        apiStatus = "successfully_retrieved_customers",
        message = "Successfully able to retrieve customers",
        success = true
      });
    }
    [HttpGet("GetById/{id}")]
    public IActionResult GetById(int id = 0)
    {
      var pays = db.Payments.Where(s => s.Id == id);
      var result = pays.Select(s => new
      {
        s.Id,
        s.Date,
        s.PlayerId,
        Player = s.Player.Name,
        s.TrenerId,
        Trener = s.Trener.Name,
        s.Total
      }).FirstOrDefault();
      return Ok(new
      {
        model = result,
        apiStatus = "successfully_retrieved_customers",
        message = "Successfully able to retrieve customers",
        success = true
      });
    }
  }
}