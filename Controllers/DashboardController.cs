using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TennisCLI.Models;

namespace TennisCLI.Controllers
{
  [Route("api/dashboard")]
  public class DashboardController : Controller
  {
    private long start = 1483401600000;
    private int year = 2017;
    private int month = 10;
    private TennisDbContext db;
    public DashboardController(TennisDbContext tennisContext)
    {
      db = tennisContext;
    }

    [HttpGet("Payments")]
    public IActionResult PaymentsTotals()
    {
      var totals = db.Payments.Where(s => s.Year == year).GroupBy(s => new { s.Month }).Select(s => new { s.Key.Month, Total = s.Sum(t => t.Total) });
      return Ok(new
      {
        model = totals,
        apiStatus = "successfully_retrieved_payments",
        message = "Successfully able to retrieve payments",
        success = true
      });
    }
    [HttpGet("Subscribes")]
    public IActionResult SubscribesTotals()
    {
      var reservs = db.Reservations.Where(s => s.Year == year);
      var players = db.SubscribePlayers.Where(s => reservs.Any(r => r.Id == s.ReservationId));
      var totals = db.SubscribeTreners.Where(t => players.Any(p => p.ReservationId == t.ReservationId)).Select(s => new {
        s.Reservation.Month,
        Total = s.Reservation.Range
      }).GroupBy(s => new {s.Month }).Select(s => new { s.Key.Month,Total = s.Sum(i => i.Total)/900000 });
      return Ok(new
      {
        model = totals,
        apiStatus = "successfully_retrieved_subscribes",
        message = "Successfully able to retrieve subscribes",
        success = true
      });
    }
    [HttpGet("Orders")]
    public IActionResult OrdersTotals()
    {
      var reservs = db.Reservations.Where(s => s.Year == year);
      var players = db.SubscribePlayers.Where(s => reservs.Any(r => r.Id == s.ReservationId) && s.Order);
      var totals = db.SubscribeTreners.Where(t=>players.Any(p=>p.ReservationId==t.ReservationId)).Select(s => new {
        s.Reservation.Month,
        Total = s.Reservation.Total
      }).GroupBy(s => new { s.Month }).Select(s => new { s.Key.Month, Total = s.Sum(i => i.Total) });
      return Ok(new
      {
        model = totals,
        apiStatus = "successfully_retrieved_orders",
        message = "Successfully able to retrieve orders",
        success = true
      });
    }
    [HttpGet("Customers")]
    public IActionResult CustomersTotals()
    {
      var reservs = db.Reservations.Where(s => s.Year == year);
      var totals = db.SubscribePlayers.Where(t => reservs.Any(p => p.Id == t.ReservationId)).Select(s => new {
        s.Reservation.Month,
        s.PlayerId
      }).GroupBy(s => new { s.Month }).Select(s => new { s.Key.Month, Total = s.Distinct().Count() });
      return Ok(new
      {
        model = totals,
        apiStatus = "successfully_retrieved_customers",
        message = "Successfully able to retrieve customers",
        success = true
      });
    }
  }
}